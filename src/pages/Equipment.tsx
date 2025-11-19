import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Plus, Search, Wrench, Edit, Trash2, Upload, X, Package, TrendingUp, Clock, PieChart, DollarSign, FileDown, ListPlus } from 'lucide-react'

interface Equipment {
  id: string
  title: string
  photo_url?: string
  size?: string
  material?: string
  quantity?: number
  notes?: string
  category?: string
  status?: string
  created_at: string
  updated_at: string
}

const EQUIPMENT_CATEGORIES = ['Cookie Cutters', 'Stamps', 'Tools', 'Materials', 'Other']
const FILTER_CATEGORIES = ['All', ...EQUIPMENT_CATEGORIES]

const STATUS_OPTIONS = [
  { value: 'in_use', label: 'In Use', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'low_qty', label: 'Low Qty', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'needs_cleaning', label: 'Needs Cleaning', color: 'bg-blue-100 text-blue-700 border-blue-200' },
]

export default function Equipment() {
  const { user } = useAuth()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    photo_url: '',
    size: '',
    material: '',
    quantity: 1,
    notes: '',
    category: 'Other',
    status: 'in_use'
  })

  useEffect(() => {
    if (user) {
      fetchEquipment()
    }
  }, [user])

  const fetchEquipment = async () => {
    if (!user) return
    try {
      const response: any = await api.equipment.getAll('')
      setEquipment(response.equipment || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingPhoto(true)
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      const { url } = await api.equipment.uploadPhoto(file)
      setFormData({ ...formData, photo_url: url })
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      if (editingEquipment) {
        await api.equipment.update('', editingEquipment.id, formData)
      } else {
        await api.equipment.create('', formData)
      }

      setFormData({
        title: '',
        photo_url: '',
        size: '',
        material: '',
        quantity: 1,
        notes: '',
        category: 'Other',
        status: 'in_use'
      })
      setPhotoPreview(null)
      setShowForm(false)
      setEditingEquipment(null)
      fetchEquipment()
    } catch (error) {
      console.error('Error saving equipment:', error)
      alert('Failed to save equipment. Please try again.')
    }
  }

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item)
    setFormData({
      title: item.title,
      photo_url: item.photo_url || '',
      size: item.size || '',
      material: item.material || '',
      quantity: item.quantity || 1,
      notes: item.notes || '',
      category: item.category || 'Other',
      status: item.status || 'in_use'
    })
    setPhotoPreview(item.photo_url || null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return
    try {
      await api.equipment.delete('', id)
      fetchEquipment()
    } catch (error) {
      console.error('Error deleting equipment:', error)
      alert('Failed to delete equipment. Please try again.')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEquipment(null)
    setPhotoPreview(null)
    setFormData({
      title: '',
      photo_url: '',
      size: '',
      material: '',
      quantity: 1,
      notes: '',
      category: 'Other',
      status: 'in_use'
    })
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.size?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.material?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalValue = filteredEquipment.reduce((sum, item) => sum + (item.quantity || 0), 0) * 50
  const mostUsed = equipment.length > 0 ? equipment[0]?.title || 'N/A' : 'N/A'
  const plaCount = equipment.filter(item => item.material?.toLowerCase().includes('pla')).length
  const resinCount = equipment.filter(item => item.material?.toLowerCase().includes('resin')).length
  const materialPercentage = equipment.length > 0
    ? `${Math.round((plaCount / equipment.length) * 100)}% PLA / ${Math.round((resinCount / equipment.length) * 100)}% Resin`
    : '0% PLA / 0% Resin'
  const lastAdded = equipment.length > 0
    ? new Date(equipment[equipment.length - 1]?.created_at || Date.now()).toLocaleDateString()
    : 'N/A'

  const getStatusConfig = (status?: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-8 shadow-sm border border-orange-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Equipment Library – {equipment.length} {equipment.length === 1 ? 'tool' : 'tools'} in your kitchen arsenal
            </h1>
            <p className="text-gray-600">
              Track and manage your bakery tools, from cookie cutters to mixing bowls
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => alert('Import functionality coming soon!')}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-200 shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button
              onClick={() => alert('Bulk add functionality coming soon!')}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-200 shadow-sm"
            >
              <ListPlus className="w-4 h-4" />
              <span>Bulk Add</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Equipment</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
            <div className="flex items-center space-x-2 text-orange-600 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Estimated inventory value</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
            <div className="flex items-center space-x-2 text-orange-600 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Most Used</span>
            </div>
            <p className="text-lg font-bold text-gray-800 truncate">{mostUsed}</p>
            <p className="text-xs text-gray-500 mt-1">Your go-to tool</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
            <div className="flex items-center space-x-2 text-orange-600 mb-2">
              <PieChart className="w-5 h-5" />
              <span className="text-sm font-medium">Materials</span>
            </div>
            <p className="text-sm font-bold text-gray-800">{materialPercentage}</p>
            <p className="text-xs text-gray-500 mt-1">Material breakdown</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
            <div className="flex items-center space-x-2 text-orange-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Last Added</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{lastAdded}</p>
            <p className="text-xs text-gray-500 mt-1">Most recent addition</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment by name, size, or material..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {filteredEquipment.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Showing {filteredEquipment.length} of {equipment.length} items</span>
          </div>
        )}
      </div>

      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((item) => {
            const statusConfig = getStatusConfig(item.status)
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="aspect-square bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
                  {item.photo_url ? (
                    <img
                      src={item.photo_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wrench className="w-20 h-20 text-orange-200" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-orange-50 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-orange-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">{item.title}</h3>
                  <div className="space-y-2 text-sm">
                    {item.size && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium text-gray-700">{item.size}</span>
                      </div>
                    )}
                    {item.material && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Material:</span>
                        <span className="font-medium text-gray-700">{item.material}</span>
                      </div>
                    )}
                    {item.quantity && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium text-gray-700">{item.quantity}</span>
                      </div>
                    )}
                  </div>
                  {item.category && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchQuery || selectedCategory !== 'All' ? 'No equipment found' : 'No equipment added yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Start building your equipment library by adding your first item'}
          </p>
          {!searchQuery && selectedCategory === 'All' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
            >
              Add Your First Equipment
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-orange-300">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Wrench className="w-12 h-12 text-orange-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all">
                      <Upload className="w-5 h-5" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 9-inch Round Cake Pan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {EQUIPMENT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 9 inches diameter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., PLA, Resin, Aluminum"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Any additional information about this equipment..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={uploadingPhoto}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
                >
                  {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
