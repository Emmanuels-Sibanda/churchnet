# South African Localization Updates

## Changes Implemented

### 1. ✅ Currency Changed to South African Rand (ZAR)
- All `$` symbols replaced with `R` (Rand)
- Created `client/src/utils/currency.js` utility for consistent formatting
- Updated all price displays throughout the application

### 2. ✅ State → Province
- Database schema updated: `state` column renamed to `province`
- All backend routes updated to use `province`
- Frontend forms updated with South African provinces dropdown:
  - Eastern Cape
  - Free State
  - Gauteng
  - KwaZulu-Natal
  - Limpopo
  - Mpumalanga
  - Northern Cape
  - North West
  - Western Cape

### 3. ✅ Booking Price Options
- Added `price_option` field to bookings table
- Options: `hourly`, `half_day`, `full_day`
- Updated booking creation to accept price option
- Price calculation based on selected option:
  - **Hourly**: Uses `price_per_hour` × hours
  - **Half Day**: Uses `price_per_half_day` (or calculated fallback)
  - **Full Day**: Uses `price_per_day` (or calculated fallback)
- Frontend booking form includes price option selector

### 4. ✅ Venue Amenities
- Added amenities support to venues
- Available amenities:
  - **WiFi** (wifi)
  - **Parking** (parking)
  - **Restrooms** (restrooms)
- Amenities displayed with icons on venue detail pages
- Amenities checkboxes added to venue creation form in Dashboard

## Database Schema Changes

### Venues Table
```sql
-- Added:
price_per_half_day DECIMAL(10, 2)
province TEXT (replaces state)

-- Existing:
amenities TEXT (JSON array)
```

### Bookings Table
```sql
-- Added:
price_option TEXT DEFAULT 'hourly' CHECK(price_option IN ('hourly', 'half_day', 'full_day'))
```

### Churches Table
```sql
-- Changed:
province TEXT (replaces state)
```

## Files Modified

### Backend
- `server/database/db.js` - Schema updates
- `server/routes/auth.js` - Province support
- `server/routes/venues.js` - Province, half-day pricing, amenities
- `server/routes/bookings.js` - Price option support
- `server/routes/churches.js` - Province support
- `server/routes/equipment.js` - Province support

### Frontend
- `client/src/utils/currency.js` - NEW: Currency formatting utility
- `client/src/pages/Register.js` - Province dropdown
- `client/src/pages/VenueDetail.js` - Currency, province, amenities, price options
- `client/src/pages/Dashboard.js` - Province, amenities checkboxes, half-day pricing
- `client/src/pages/MyBookings.js` - Currency formatting (needs update)
- `client/src/pages/Venues.js` - Province filter, currency (needs update)
- `client/src/pages/Equipment.js` - Province, currency (needs update)
- `client/src/pages/EquipmentDetail.js` - Province, currency (needs update)
- `client/src/pages/Home.js` - Currency reference (needs update)

## Remaining Updates Needed

The following files still need currency and province updates:
1. `client/src/pages/MyBookings.js` - Change `$` to `R`
2. `client/src/pages/Venues.js` - Change `state` to `province`, `$` to `R`
3. `client/src/pages/Equipment.js` - Change `state` to `province`, `$` to `R`
4. `client/src/pages/EquipmentDetail.js` - Change `state` to `province`, `$` to `R`
5. `client/src/pages/Home.js` - Update currency reference in testimonials

## Migration Notes

⚠️ **Important**: Existing databases will need migration:
1. The `state` column needs to be renamed to `province` in existing databases
2. The `price_per_half_day` column needs to be added to venues table
3. The `price_option` column needs to be added to bookings table

For new installations, the schema will be created correctly automatically.

## Testing Checklist

- [ ] Register new church with province selection
- [ ] Create venue with amenities (wifi, parking, restrooms)
- [ ] Create venue with half-day pricing
- [ ] Book venue with different price options (hourly, half-day, full-day)
- [ ] Verify currency displays as R (Rand) throughout
- [ ] Verify province displays correctly
- [ ] Test province filter in venues search

## Usage Examples

### Creating a Venue with Amenities
```javascript
{
  name: "Main Hall",
  price_per_hour: 500,
  price_per_half_day: 1800,
  price_per_day: 3000,
  province: "Gauteng",
  amenities: ["wifi", "parking", "restrooms"]
}
```

### Booking with Price Option
```javascript
{
  venue_id: 1,
  start_date: "2025-01-15T10:00:00",
  end_date: "2025-01-15T14:00:00",
  price_option: "half_day" // or "hourly" or "full_day"
}
```

