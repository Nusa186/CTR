/*
  # Tree Cutting Request Schema

  1. New Tables
    - tree_cutting_requests
      - id (uuid, primary key)
      - title (text)
      - request_type (text)
      - description (text)
      - location (text)
      - number_of_trees (integer)
      - area_hectares (numeric)
      - plan_start_date (date)
      - plan_end_date (date)
      - department_approver (text)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on tree_cutting_requests table
    - Add policies for authenticated users
*/

CREATE TABLE tree_cutting_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  request_type text NOT NULL,
  description text,
  location text NOT NULL,
  number_of_trees integer NOT NULL,
  area_hectares numeric NOT NULL,
  plan_start_date date NOT NULL,
  plan_end_date date NOT NULL,
  department_approver text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tree_cutting_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
  ON tree_cutting_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON tree_cutting_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);