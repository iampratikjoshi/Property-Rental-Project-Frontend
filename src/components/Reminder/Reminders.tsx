import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import Select from "react-select"; // For dropdowns
import { Calendar, Bell, Clock } from "lucide-react"; // Icons for better UI
import axios from "axios";
import { format } from "date-fns";

const ReminderForm = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const [errorMessage, setErrorMessage] = useState(""); // State for backend error messages
  const [timeoutId, setTimeoutId] = useState(null); // To manage success popup timeout
  

  // Options for "priority" dropdown
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(""); // Clear previous error messages
    try {

     // Combine date and time into a single datetime string
const combinedDateTime = new Date(`${data.date}T${data.time}:00.000Z`);

if (isNaN(combinedDateTime.getTime())) {
  throw new Error("Invalid date or time");
}

// Format dateTime in SQL Server-compatible format (YYYY-MM-DD HH:mm:ss)
const formattedDateTime = format(combinedDateTime, "yyyy-MM-dd HH:mm:ss");

// Prepare payload for backend
const payload = {
  subject: data.subject,
  about: data.about,
  dateTime: formattedDateTime, // Correctly formatted dateTime
  priority: data.priority,
  notes: data.notes || "", // Optional field
  createdBy: "user", // Hardcoded as per backend requirement
};

console.log("Formatted dateTime:", formattedDateTime); // Debugging

      // Send data to backend API
      await axios.post("http://localhost:4000/reminder/create", payload);

      // Show success popup
      setShowSuccessPopup(true);
      clearTimeout(timeoutId); // Clear any existing timeout
      setTimeoutId(setTimeout(() => setShowSuccessPopup(false), 3000)); // Hide after 3 seconds
    } catch (error) {
      console.error("Error setting reminder:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed to set reminder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 animate-fade-in">
          <Bell size={20} className="text-white" />
          <span>Reminder set successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 animate-fade-in">
          <Bell size={20} className="text-white" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
          <Bell size={24} className="mr-2 text-blue-500" />
          Set Reminder
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              placeholder="Enter reminder subject..."
              {...register("subject", { required: "This field is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          {/* What the reminder is about */}
          <div>
            <label className="block text-sm font-medium text-gray-700">About</label>
            <input
              type="text"
              placeholder="Enter Description..."
              {...register("about", { required: "This field is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.about && (
              <p className="text-red-500 text-sm">{errors.about.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <div className="flex items-center mt-1">
                <Calendar size={20} className="text-gray-500 mr-2" />
                <input
                  type="date"
                  {...register("date", { required: "This field is required" })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <div className="flex items-center mt-1">
                <Clock size={20} className="text-gray-500 mr-2" />
                <input
                  type="time"
                  {...register("time", { required: "This field is required" })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Priority level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue="low" // Default to "low" priority
              render={({ field }) => (
                <Select
                  options={priorityOptions}
                  placeholder="Select priority..."
                  value={priorityOptions.find((option) => option.value === field.value)}
                  onChange={(selectedOption) => field.onChange(selectedOption.value)}
                  className="mt-1"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      borderColor: errors.priority ? "red" : "#d1d5db",
                    }),
                  }}
                />
              )}
            />
            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority.message}</p>
            )}
          </div>

          {/* Additional notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows="3"
              placeholder="Add additional details..."
              {...register("notes")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Setting Reminder..." : "Set Reminder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;