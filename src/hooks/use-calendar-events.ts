'use client';

import { useState } from 'react';
import {
  createTableRecord,
  deleteTableRecords,
  updateTableRecord
} from '@/services/controllers/table';
import { notify } from '@/hooks/toastUtils';
import { useSelector } from 'react-redux';

export function useCalendarEvents(
  users,
  setSelectedEvent,
  setIsCreating,
  isEditing,
  getMeetData,
  setIsEditing
) {
  const [meetData, setMeetData] = useState([]);
  const [meetDetail, setMeetDetail] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState([]);

  const { currentUser } = useSelector(
    (state: {
      auth: { currentUser: { user: { user_email: string } } | null };
    }) => state.auth
  );

  const [eventData, setEventData] = useState({
    subject: '',
    location: '',
    type: '',
    channel: '',
    details: '',
    from_date: '',
    to_date: '',
    attendees: [],
    uuid: '',
    raw: { uuid: '' }
  });

  const validateEventData = () => {
    if (!eventData.subject?.trim()) {
      notify.warning('Subject is required');
      return false;
    }
    if (!selectedAttendeeIds || selectedAttendeeIds.length === 0) {
      notify.warning('At least one attendee is required');
      return false;
    }
    if (!eventData.from_date) {
      notify.warning('From date is required');
      return false;
    }
    if (!eventData.to_date) {
      notify.warning('To date is required');
      return false;
    }
    if (!eventData.location?.trim()) {
      notify.warning('Location is required');
      return false;
    }
    if (!eventData.type) {
      notify.warning('meeting type is required');
      return false;
    }
    // @ts-ignore
    if (eventData.type == 1 && !eventData.channel?.trim()) {
      notify.warning('Channel is required for online meetings');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateEventData()) return;
    setBtnLoading(true);
    const payload = {
      ...eventData,
      attendees: selectedAttendeeIds,
      host_email: currentUser?.user?.user_email
    };

    try {
      const response = isEditing
        ? await updateTableRecord('system_meetings', eventData?.uuid, payload)
        : await createTableRecord('system_meetings', payload);

      if (!response.status) {
        throw new Error('Failed to create/update event');
      }
      getMeetData();
      notify.success('Event saved successfully');
      setBtnLoading(false);
      // Refresh data would be called here
      setSelectedEvent(null);
      setIsCreating(false);
      setIsEditing(false);
    } catch (error) {
      notify.error('Something went wrong' || error?.message);
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setBtnLoading(true);
    try {
      const response = await deleteTableRecords('system_meetings', [id]);

      if (!response.status) {
        throw new Error('Failed to delete event');
      }
      getMeetData();
      notify.success('Event deleted successfully');
      setBtnLoading(false);
      // Refresh data would be called here
      setSelectedEvent(null);
    } catch (error) {
      notify.error('Something went wrong' || error?.message);
      setBtnLoading(false);
    }
  };

  return {
    meetData,
    setMeetData,
    meetDetail,
    setMeetDetail,
    eventData,
    setEventData,
    selectedAttendeeIds,
    setSelectedAttendeeIds,
    handleSave,
    handleDelete,
    btnLoading
  };
}
