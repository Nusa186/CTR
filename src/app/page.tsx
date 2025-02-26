'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Trees, MapPin, Calendar, Users, FileText, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { de } from 'date-fns/locale';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FormData {
  title: string;
  requestType: string;
  description: string;
  location: string;
  numberOfTrees: number;
  areaHectares: number;
  planStartDate: Date;
  planEndDate: Date;
  departmentApprover: string[];
}

const requestTypes = ['Tree Cutting with Land Clearance', 'Tree Cutting w/o Land Clearance', 'Tree Cutting for Safety Reason'];
const locations = ['Mining Area', 'Project Expansion Area', 'Powerline Area', 'Exploration', 'Other Area'];
const approvers = [{email:'kodratnusantara@gmail.com', department: 'IT'},];

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    requestType: requestTypes[0],
    description: '',
    location: locations[0],
    numberOfTrees: 0,
    areaHectares: 0,
    planStartDate: new Date(),
    planEndDate: new Date(),
    departmentApprover: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Insert request into Supabase
      const { data: requestData, error: supabaseError } = await supabase
        .from('tree_cutting_requests')
        .insert([
          {
            title: formData.title,
            request_type: formData.requestType,
            description: formData.description,
            location: formData.location,
            number_of_trees: formData.numberOfTrees,
            area_hectares: formData.areaHectares,
            plan_start_date: formData.planStartDate.toISOString().split('T')[0],
            plan_end_date: formData.planEndDate.toISOString().split('T')[0],
            department_approver: formData.departmentApprover,
            status: 'pending'
          },
        ])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Send approval emails
      const emailResponse = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestData: requestData[0],
          approvers: formData.departmentApprover,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send approval emails');
      }

      setSubmitStatus({ 
        type: 'success', 
        message: 'Your tree cutting request has been submitted and approval emails have been sent!' 
      });

      // Reset form
      setFormData({
        title: '',
        requestType: requestTypes[0],
        description: '',
        location: locations[0],
        numberOfTrees: 0,
        areaHectares: 0,
        planStartDate: new Date(),
        planEndDate: new Date(),
        departmentApprover: [],
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: `Request submission failed: ${error.message || 'Please check your input and try again.'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 border-t-4 border-primary">
          <div className="flex items-center mb-8">
            <Trees className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-secondary">Tree Cutting Request</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-secondary font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-secondary font-medium mb-2">Request Type</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {requestTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-secondary font-medium mb-2">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-secondary font-medium mb-2">
                <FileText className="inline-block w-4 h-4 mr-1" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-secondary font-medium mb-2">Number of Trees</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.numberOfTrees}
                  onChange={(e) => setFormData({ ...formData, numberOfTrees: parseInt(e.target.value) })}
                  className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-secondary font-medium mb-2">Area (Hectares)</label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={formData.areaHectares}
                  onChange={(e) => setFormData({ ...formData, areaHectares: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-secondary font-medium mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Plan Start Date
                </label>
                <DatePicker
                  selected={formData.planStartDate}
                  onChange={(date) => setFormData({ ...formData, planStartDate: date || new Date() })}
                  className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div>
                <label className="block text-secondary font-medium mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Plan End Date
                </label>
                <DatePicker
                  selected={formData.planEndDate}
                  onChange={(date) => setFormData({ ...formData, planEndDate: date || new Date() })}
                  minDate={formData.planStartDate}
                  className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>

            <div>
              <label className="block text-secondary font-medium mb-2">
                <Users className="inline-block w-4 h-4 mr-1" />
                Department Approvers
              </label>
              <select
                multiple
                value={formData.departmentApprover}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  departmentApprover: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full p-3 border border-accent rounded focus:outline-none focus:ring-2 focus:ring-primary"
                size={3}
              >
                {approvers.map(({ email, department }) => (
                  <option key={email} value={email}>
                    {`${department.split('@')[0].replace('.', ' ').toUpperCase()} - ${email}`}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Hold Ctrl (Windows) or Command (Mac) to select multiple departments
              </p>
            </div>

            {submitStatus && (
              <div 
                className={`p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || formData.departmentApprover.length === 0}
              className={`w-full py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center ${
                isSubmitting || formData.departmentApprover.length === 0
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-primary hover:bg-opacity-90 text-secondary font-bold'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <span>Submit Request</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}