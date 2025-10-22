# BakeStatements Architecture

## Modular Structure

The application has been refactored into a compartmentalized architecture:

### Services Layer (`src/services/`)
- **ordersService**: Order management operations
- **expensesService**: Expense tracking operations

Each service handles its domain independently with clean interfaces.

### Shared Utilities (`src/shared/utils/`)
- **formatters**: Currency, date formatting
- **calculations**: GST, profit, markup calculations
- **statusColors**: Status badge color mappings

### Shared Components (`src/shared/components/`)
- **LoadingSpinner**: Reusable loading indicator

### Type Definitions (`src/shared/types/`)
- Centralized TypeScript interfaces for data models

## Usage

```typescript
import { ordersService } from '@/services'
import { formatCurrency } from '@/shared/utils'
import { LoadingSpinner } from '@/shared/components'

const { orders } = await ordersService.getAll()
const price = formatCurrency(99.99)
```

This structure improves maintainability, reusability, and testability.
