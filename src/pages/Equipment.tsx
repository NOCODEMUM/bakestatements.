import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { Plus, Search, Wrench, Edit, Trash2, Upload, X, Package } from 'lucide-react'

interface Equipment {
  id: string
  title: string
  photo_url?: string
  size?: string
  material?: string
  quantity?: number
  notes?: string
  category?: string
  created_at: string
  updated_at: string
}

const EQUIPMENT_CATEGORIES = [
  'All',
  'Cake Pans',
  'Cookie Cutters',
  'Mixing Bowls',
  'Measuring Tools',
  'Decorating Tools',
  'Baking Sheets',
  'Molds & Forms',
  'Other'
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
    category: 'Other'
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
        category: 'Other'
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
      category: item.category || 'Other'
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
      category: 'Other'
    })
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.size?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.material?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Equipment Library</h1>
          <p className="text-gray-600">Keep track of your baking tools and equipment</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Equipment</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment by name, size, or material..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {EQUIPMENT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {filteredEquipment.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredEquipment.length} of {equipment.length} items
          </div>
        )}
      </div>

      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Wrench className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-amber-50 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-amber-600" />
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
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {item.size && (
                    <p>Size: {item.size}</p>
                  )}
                  {item.material && (
                    <p>Material: {item.material}</p>
                  )}
                  {item.quantity && (
                    <p>Quantity: {item.quantity}</p>
                  )}
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium mt-2">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Add Your First Equipment
            </button>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Wrench className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {EQUIPMENT_CATEGORIES.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Aluminum, Silicone"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Any additional information about this equipment..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={uploadingPhoto}
                  className="flex-1 bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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
