import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowDown, ArrowUp } from 'lucide-react';

const AllReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);

  // Fetch all reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/reminder/getallreminders');
        setReminders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  // Function to handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Function to filter reminders based on status
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch = reminder.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'read' && reminder.isRead) ||
      (filterStatus === 'unread' && !reminder.isRead);
    return matchesSearch && matchesStatus;
  });

  // Function to sort reminders
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.dateTime) - new Date(b.dateTime)
        : new Date(b.dateTime) - new Date(a.dateTime);
    } else if (sortBy === 'subject') {
      return sortOrder === 'asc'
        ? a.subject.localeCompare(b.subject)
        : b.subject.localeCompare(a.subject);
    }
    return 0;
  });

  // Function to handle deleting a reminder
  const handleDelete = async (reminderId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/reminder/delete/${reminderId}`
      );

      if (response.status === 200) {
        // Remove the deleted reminder from the state
        setReminders(reminders.filter((reminder) => reminder.reminderId !== reminderId));
      } else {
        console.error('Failed to delete reminder:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Function to open the edit modal
  const openEditModal = (reminder) => {
    setSelectedReminder(reminder);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReminder(null);
  };

  // Function to handle saving changes to a reminder
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const { reminderId, subject, about, dateTime } = selectedReminder;

      // Call the update API
      const response = await axios.put(
        `http://localhost:4000/reminder/update/${reminderId}`,
        { subject, about, dateTime }
      );

      if (response.status === 200) {
        // Update the reminder in the state
        setReminders(
          reminders.map((reminder) =>
            reminder.reminderId === reminderId ? { ...reminder, subject, about, dateTime } : reminder
          )
        );
        closeEditModal();
      } else {
        console.error('Failed to update reminder:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header and Search/Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">All Reminders</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Reminders Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading reminders...</p>
      ) : sortedReminders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('subject')}
                >
                  <div className="flex items-center gap-1">
                    Subject
                    {sortBy === 'subject' && (sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortBy === 'date' && (sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">About</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedReminders.map((reminder) => (
                <tr key={reminder.reminderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{reminder.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reminder.dateTime).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reminder.about}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        reminder.isRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reminder.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(reminder)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(reminder.reminderId)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No reminders found.</p>
      )}

      {/* Edit Reminder Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Reminder</h2>
            <form onSubmit={handleSaveChanges}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={selectedReminder?.subject || ''}
                  onChange={(e) =>
                    setSelectedReminder({ ...selectedReminder, subject: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  value={selectedReminder?.about || ''}
                  onChange={(e) =>
                    setSelectedReminder({ ...selectedReminder, about: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date and Time</label>
                <input
                  type="datetime-local"
                  value={selectedReminder?.dateTime || ''}
                  onChange={(e) =>
                    setSelectedReminder({ ...selectedReminder, dateTime: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReminders;