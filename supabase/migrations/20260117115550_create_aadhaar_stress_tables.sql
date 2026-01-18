/*
  # National Stress Index Monitoring System - Database Schema
  
  ## Overview
  Creates comprehensive database structure for tracking Aadhaar enrollment data and calculating 
  stress indices across Indian states.
  
  ## New Tables
  
  ### 1. `states`
  Stores information about all Indian states and union territories
  - `id` (uuid, primary key) - Unique identifier
  - `state_code` (text, unique) - Two-letter state code (e.g., 'MH', 'DL', 'IN' for all India)
  - `state_name_en` (text) - State name in English
  - `state_name_hi` (text) - State name in Hindi
  - `population` (bigint) - Current population
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 2. `aadhaar_enrollment`
  Monthly Aadhaar enrollment data for each state
  - `id` (uuid, primary key) - Unique identifier
  - `state_code` (text) - Reference to state
  - `month` (date) - Month of enrollment
  - `total_enrollments` (bigint) - Total enrollments in the month
  - `new_enrollments` (bigint) - New enrollments in the month
  - `updates` (bigint) - Updates to existing enrollments
  - `rejections` (bigint) - Rejected applications
  - `pending` (bigint) - Pending applications
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 3. `demographic_data`
  Monthly demographic data for stress calculation
  - `id` (uuid, primary key) - Unique identifier
  - `state_code` (text) - Reference to state
  - `month` (date) - Month of data
  - `population_covered` (bigint) - Population covered by Aadhaar
  - `coverage_percentage` (numeric) - Percentage of population covered
  - `urban_enrollments` (bigint) - Urban area enrollments
  - `rural_enrollments` (bigint) - Rural area enrollments
  - `male_enrollments` (bigint) - Male enrollments
  - `female_enrollments` (bigint) - Female enrollments
  - `other_enrollments` (bigint) - Other gender enrollments
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### 4. `stress_metrics`
  Calculated stress indices for analysis
  - `id` (uuid, primary key) - Unique identifier
  - `state_code` (text) - Reference to state
  - `month` (date) - Month of calculation
  - `stress_index` (numeric) - Current month stress index (0-100)
  - `annual_stress_index` (numeric) - Yearly average stress index (0-100)
  - `monthly_contribution_score` (numeric) - Monthly contribution to stress (percentage)
  - `month_to_month_change` (numeric) - Change from previous month (percentage)
  - `enrollment_rate` (numeric) - Enrollment rate factor
  - `rejection_rate` (numeric) - Rejection rate factor
  - `pending_rate` (numeric) - Pending applications rate
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Add policies for public read access (government data is public)
  - Restrict write access to authenticated service roles only
  
  ## Indexes
  - Add indexes on state_code and month columns for efficient querying
  - Add composite indexes for common query patterns
*/

-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text UNIQUE NOT NULL,
  state_name_en text NOT NULL,
  state_name_hi text NOT NULL,
  population bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create aadhaar_enrollment table
CREATE TABLE IF NOT EXISTS aadhaar_enrollment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text NOT NULL,
  month date NOT NULL,
  total_enrollments bigint DEFAULT 0,
  new_enrollments bigint DEFAULT 0,
  updates bigint DEFAULT 0,
  rejections bigint DEFAULT 0,
  pending bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_code, month)
);

-- Create demographic_data table
CREATE TABLE IF NOT EXISTS demographic_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text NOT NULL,
  month date NOT NULL,
  population_covered bigint DEFAULT 0,
  coverage_percentage numeric DEFAULT 0,
  urban_enrollments bigint DEFAULT 0,
  rural_enrollments bigint DEFAULT 0,
  male_enrollments bigint DEFAULT 0,
  female_enrollments bigint DEFAULT 0,
  other_enrollments bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_code, month)
);

-- Create stress_metrics table
CREATE TABLE IF NOT EXISTS stress_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code text NOT NULL,
  month date NOT NULL,
  stress_index numeric DEFAULT 0,
  annual_stress_index numeric DEFAULT 0,
  monthly_contribution_score numeric DEFAULT 0,
  month_to_month_change numeric DEFAULT 0,
  enrollment_rate numeric DEFAULT 0,
  rejection_rate numeric DEFAULT 0,
  pending_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_code, month)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_aadhaar_state_month ON aadhaar_enrollment(state_code, month DESC);
CREATE INDEX IF NOT EXISTS idx_demographic_state_month ON demographic_data(state_code, month DESC);
CREATE INDEX IF NOT EXISTS idx_stress_state_month ON stress_metrics(state_code, month DESC);
CREATE INDEX IF NOT EXISTS idx_states_code ON states(state_code);

-- Enable Row Level Security
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE aadhaar_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access (government data is public)
CREATE POLICY "Public read access for states"
  ON states FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for aadhaar enrollment"
  ON aadhaar_enrollment FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for demographic data"
  ON demographic_data FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for stress metrics"
  ON stress_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert Indian states data
INSERT INTO states (state_code, state_name_en, state_name_hi, population) VALUES
  ('IN', 'All India', 'संपूर्ण भारत', 1400000000),
  ('AP', 'Andhra Pradesh', 'आंध्र प्रदेश', 49386799),
  ('AR', 'Arunachal Pradesh', 'अरुणाचल प्रदेश', 1382611),
  ('AS', 'Assam', 'असम', 31169272),
  ('BR', 'Bihar', 'बिहार', 103804637),
  ('CT', 'Chhattisgarh', 'छत्तीसगढ़', 25540196),
  ('GA', 'Goa', 'गोवा', 1457723),
  ('GJ', 'Gujarat', 'गुजरात', 60383628),
  ('HR', 'Haryana', 'हरियाणा', 25353081),
  ('HP', 'Himachal Pradesh', 'हिमाचल प्रदेश', 6856509),
  ('JH', 'Jharkhand', 'झारखंड', 32966238),
  ('KA', 'Karnataka', 'कर्नाटक', 61130704),
  ('KL', 'Kerala', 'केरल', 33387677),
  ('MP', 'Madhya Pradesh', 'मध्य प्रदेश', 72597565),
  ('MH', 'Maharashtra', 'महाराष्ट्र', 112372972),
  ('MN', 'Manipur', 'मणिपुर', 2721756),
  ('ML', 'Meghalaya', 'मेघालय', 2964007),
  ('MZ', 'Mizoram', 'मिजोरम', 1091014),
  ('NL', 'Nagaland', 'नागालैंड', 1980602),
  ('OD', 'Odisha', 'ओडिशा', 41947358),
  ('PB', 'Punjab', 'पंजाब', 27704236),
  ('RJ', 'Rajasthan', 'राजस्थान', 68621012),
  ('SK', 'Sikkim', 'सिक्किम', 607688),
  ('TN', 'Tamil Nadu', 'तमिलनाडु', 72138958),
  ('TG', 'Telangana', 'तेलंगाना', 35193978),
  ('TR', 'Tripura', 'त्रिपुरा', 3671032),
  ('UP', 'Uttar Pradesh', 'उत्तर प्रदेश', 199581477),
  ('UT', 'Uttarakhand', 'उत्तराखंड', 10116752),
  ('WB', 'West Bengal', 'पश्चिम बंगाल', 91347736),
  ('AN', 'Andaman and Nicobar Islands', 'अंडमान और निकोबार द्वीप समूह', 379944),
  ('CH', 'Chandigarh', 'चंडीगढ़', 1054686),
  ('DN', 'Dadra and Nagar Haveli and Daman and Diu', 'दादरा और नगर हवेली और दमन और दीव', 586956),
  ('DL', 'Delhi', 'दिल्ली', 16753235),
  ('JK', 'Jammu and Kashmir', 'जम्मू और कश्मीर', 12548926),
  ('LA', 'Ladakh', 'लद्दाख', 274289),
  ('LD', 'Lakshadweep', 'लक्षद्वीप', 64429),
  ('PY', 'Puducherry', 'पुदुच्चेरी', 1244464)
ON CONFLICT (state_code) DO NOTHING;
