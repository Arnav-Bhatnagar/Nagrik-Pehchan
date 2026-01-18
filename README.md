# National Stress Index Monitoring System
### राष्ट्रीय तनाव सूचकांक निगरानी प्रणाली

A comprehensive government-style monitoring system for tracking Aadhaar enrollment data and calculating stress indices across all Indian states and union territories.

## Features

### 4 Core Stress Metrics

1. **Stress Index**: Real-time stress level calculated based on:
   - Rejection rates of Aadhaar applications
   - Pending application rates
   - Coverage percentage gaps
   - Enrollment velocity

2. **Annual Stress Index**: 12-month rolling average providing a smoothed view of stress trends over time

3. **Monthly Contribution Score**: Percentage contribution of the current month to overall stress levels, helping identify which months are most problematic

4. **Month-to-Month Change Index**: Percentage change from the previous month, showing acceleration or deceleration of stress

### Key Capabilities

- **State Selection**: View data for all 36 states/UTs or India as a whole
- **Multilingual Support**: Toggle between English and Hindi (भारत की आधिकारिक भाषाएं)
- **Interactive Visualizations**:
  - Line charts showing stress trends over time
  - Bar charts for monthly contribution analysis
  - Color-coded month-to-month changes
- **Government Styling**: Professional interface using Indian tricolor theme
- **Real-time Data**: Powered by Supabase with instant updates

## Database Schema

### Tables

1. **states**: All Indian states and union territories with population data
2. **aadhaar_enrollment**: Monthly enrollment metrics (new, updates, rejections, pending)
3. **demographic_data**: Coverage by geography and demographics
4. **stress_metrics**: Calculated stress indices and related scores

## Technology Stack

- **Frontend**: React (JavaScript), Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase:
   - Add your Supabase URL and anon key to the `.env` file
   - The database schema and sample data are already set up

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Data Generation

The system includes 12 months of realistic sample data for all 37 entries (36 states/UTs + All India):
- Enrollment patterns based on actual population
- Seasonal variations (higher stress in March-May)
- Realistic rejection and pending rates
- Demographic distribution (urban/rural, gender)

## Stress Calculation Formula

```
Stress Index = min(100, (
  (Rejections / New Enrollments × 500) +
  (Pending / New Enrollments × 300) +
  (Coverage Gap × 2)
)) × Seasonal Factor
```

Where:
- Seasonal factors: 1.15 for Mar-May, 1.08 for Nov-Jan, 1.0 otherwise
- Coverage Gap: max(0, 90% - current coverage)

## Government Design Principles

- Indian tricolor color scheme (orange, white, green)
- Formal typography with clear hierarchy
- High contrast for accessibility
- Professional card-based layouts
- Bilingual support for inclusivity

## License

Government of India Official System
