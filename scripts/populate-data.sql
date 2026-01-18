-- Generate sample Aadhaar enrollment and stress data for the last 12 months
-- This will create realistic data for all Indian states

-- Helper function to generate random enrollment data
DO $$
DECLARE
  state_rec RECORD;
  month_date DATE;
  month_counter INT;
  base_enrollment BIGINT;
  new_enroll BIGINT;
  updates_count BIGINT;
  rejections_count BIGINT;
  pending_count BIGINT;
  total_enroll BIGINT;
  coverage_pct NUMERIC;
  stress_val NUMERIC;
  annual_stress NUMERIC;
  contribution NUMERIC;
  prev_stress NUMERIC;
  month_change NUMERIC;
BEGIN
  -- Loop through each state
  FOR state_rec IN SELECT * FROM states LOOP
    prev_stress := 0;

    -- Generate data for last 12 months
    FOR month_counter IN 0..11 LOOP
      month_date := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month' * month_counter);

      -- Calculate base enrollment based on population
      base_enrollment := (state_rec.population * (0.85 + (RANDOM() * 0.10)))::BIGINT;

      -- Generate random enrollment metrics with realistic variations
      new_enroll := (base_enrollment * (0.01 + RANDOM() * 0.03))::BIGINT;
      updates_count := (base_enrollment * (0.005 + RANDOM() * 0.015))::BIGINT;
      rejections_count := (new_enroll * (0.02 + RANDOM() * 0.05))::BIGINT;
      pending_count := (new_enroll * (0.03 + RANDOM() * 0.08))::BIGINT;
      total_enroll := base_enrollment;

      -- Insert enrollment data
      INSERT INTO aadhaar_enrollment (
        state_code, month, total_enrollments, new_enrollments,
        updates, rejections, pending
      ) VALUES (
        state_rec.state_code, month_date, total_enroll, new_enroll,
        updates_count, rejections_count, pending_count
      ) ON CONFLICT (state_code, month) DO UPDATE SET
        total_enrollments = EXCLUDED.total_enrollments,
        new_enrollments = EXCLUDED.new_enrollments,
        updates = EXCLUDED.updates,
        rejections = EXCLUDED.rejections,
        pending = EXCLUDED.pending;

      -- Calculate coverage percentage
      coverage_pct := LEAST(100, (total_enroll::NUMERIC / NULLIF(state_rec.population, 0) * 100));

      -- Insert demographic data
      INSERT INTO demographic_data (
        state_code, month, population_covered, coverage_percentage,
        urban_enrollments, rural_enrollments,
        male_enrollments, female_enrollments, other_enrollments
      ) VALUES (
        state_rec.state_code, month_date, total_enroll, coverage_pct,
        (total_enroll * (0.30 + RANDOM() * 0.20))::BIGINT,
        (total_enroll * (0.50 + RANDOM() * 0.20))::BIGINT,
        (total_enroll * (0.48 + RANDOM() * 0.04))::BIGINT,
        (total_enroll * (0.48 + RANDOM() * 0.04))::BIGINT,
        (total_enroll * (0.001 + RANDOM() * 0.003))::BIGINT
      ) ON CONFLICT (state_code, month) DO UPDATE SET
        population_covered = EXCLUDED.population_covered,
        coverage_percentage = EXCLUDED.coverage_percentage,
        urban_enrollments = EXCLUDED.urban_enrollments,
        rural_enrollments = EXCLUDED.rural_enrollments,
        male_enrollments = EXCLUDED.male_enrollments,
        female_enrollments = EXCLUDED.female_enrollments,
        other_enrollments = EXCLUDED.other_enrollments;

      -- Calculate stress metrics
      -- Stress Index: Based on rejection rate, pending rate, and enrollment rate
      stress_val := LEAST(100, (
        (rejections_count::NUMERIC / NULLIF(new_enroll, 0) * 500) +
        (pending_count::NUMERIC / NULLIF(new_enroll, 0) * 300) +
        (CASE WHEN coverage_pct < 90 THEN (90 - coverage_pct) * 2 ELSE 0 END)
      ));

      -- Add some seasonal variation
      IF EXTRACT(MONTH FROM month_date) IN (3, 4, 5) THEN
        stress_val := stress_val * 1.15;  -- Higher stress in March-May
      ELSIF EXTRACT(MONTH FROM month_date) IN (11, 12, 1) THEN
        stress_val := stress_val * 1.08;  -- Moderate increase in Nov-Jan
      END IF;

      -- Calculate annual average (simplified)
      annual_stress := stress_val * (0.85 + RANDOM() * 0.15);

      -- Calculate monthly contribution (how much this month contributes to overall stress)
      contribution := LEAST(100, stress_val * (0.08 + RANDOM() * 0.04));

      -- Calculate month-to-month change
      IF prev_stress > 0 THEN
        month_change := ((stress_val - prev_stress) / NULLIF(prev_stress, 0) * 100);
      ELSE
        month_change := 0;
      END IF;

      -- Insert stress metrics
      INSERT INTO stress_metrics (
        state_code, month, stress_index, annual_stress_index,
        monthly_contribution_score, month_to_month_change,
        enrollment_rate, rejection_rate, pending_rate
      ) VALUES (
        state_rec.state_code, month_date, stress_val, annual_stress,
        contribution, month_change,
        (new_enroll::NUMERIC / NULLIF(state_rec.population, 0) * 1000),
        (rejections_count::NUMERIC / NULLIF(new_enroll, 0) * 100),
        (pending_count::NUMERIC / NULLIF(new_enroll, 0) * 100)
      ) ON CONFLICT (state_code, month) DO UPDATE SET
        stress_index = EXCLUDED.stress_index,
        annual_stress_index = EXCLUDED.annual_stress_index,
        monthly_contribution_score = EXCLUDED.monthly_contribution_score,
        month_to_month_change = EXCLUDED.month_to_month_change,
        enrollment_rate = EXCLUDED.enrollment_rate,
        rejection_rate = EXCLUDED.rejection_rate,
        pending_rate = EXCLUDED.pending_rate;

      prev_stress := stress_val;
    END LOOP;
  END LOOP;
END $$;
