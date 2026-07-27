import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchRooms, fetchRoomById, createRoom, editRoom, deleteRoom } from "../actions/Rooms";
import { fetchGroups } from "../actions/Groups";
import { FormInput } from "../components/FormInput";
import { validateFields } from '../helper/vallidate_field';

import _ from 'lodash';

const ManageRooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rooms, isLoading } = useSelector((state) => state.rooms);
  const { groups } = useSelector((state) => state.groups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1 = basic info, 2 = timeslots
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    groupIds: [],
    isPublic: false,
    status: true,
  });

  const [errorForm, setErrorForm] = useState({ messages: [], fields: [] });

  // Timeslot state: { Monday: { status: true, startTime: "09:00", endTime: "18:00" }, ... }
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [timeslotSettings, setTimeslotSettings] = useState({});
  const [interval, setInterval] = useState(60); // in minutes

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleOpenModal = async (room = null) => {
    if (room) {
      const result = await dispatch(fetchRoomById(room.roomId));
      if (result.success) {
        const roomData = result.room;
        setEditingRoom(roomData);
        setFormData({
          name: roomData.name,
          capacity: roomData.capacity?.toString() || "",
          description: roomData.description || "",
          groupIds: roomData.groupIds || [],
          isPublic: roomData.isPublic === true,
          status: roomData.status === "open",
        });

        // Populate timeslot settings from API response
        const settings = {};
        DAYS.forEach(day => {
          settings[day] = { status: false, startTime: "09:00", endTime: "18:00" };
        });
        if (roomData.timeslots && roomData.timeslots.length > 0) {
          roomData.timeslots.forEach(slot => {
            if (slot.dayType && settings[slot.dayType]) {
              settings[slot.dayType] = {
                status: true,
                startTime: slot.startTime || "09:00",
                endTime: slot.endTime || "18:00"
              };
            }
          });
        }
        setTimeslotSettings(settings);
        setInterval(roomData.intervalMins ? Number(roomData.intervalMins) : 60);
      }
    } else {
      setEditingRoom(null);
      setFormData({ name: "", capacity: "", description: "", groupIds: [], isPublic: false, status: true });
      // Initialize timeslot settings for each day
      const initialSettings = {};
      DAYS.forEach(day => {
        initialSettings[day] = { status: false, startTime: "09:00", endTime: "18:00" };
      });
      setTimeslotSettings(initialSettings);
      setInterval(60);
    }
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setCurrentStep(1);
  };

  // Timeslot functions
  const handleDayToggle = (day) => {
    setTimeslotSettings(prev => ({
      ...prev,
      [day]: { ...prev[day], status: !prev[day]?.status }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setTimeslotSettings(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleApplyToAll = () => {
    const firstOpenDay = DAYS.find(day => timeslotSettings[day]?.status);
    if (firstOpenDay) {
      const { startTime, endTime } = timeslotSettings[firstOpenDay];
      const newSettings = {};
      DAYS.forEach(day => {
        newSettings[day] = { ...timeslotSettings[day], startTime, endTime };
      });
      setTimeslotSettings(newSettings);
    }
  };

  const handleApplyWorkingHours = () => {
    const newSettings = {};
    DAYS.forEach(day => {
      newSettings[day] = { status: true, startTime: "09:00", endTime: "17:00" };
    });
    setTimeslotSettings(newSettings);
  };

  // Generate hours options (00:00 to 24:00)
  const HOURS_OPTIONS = Array.from({ length: 25 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );

  // Get group ID (handle both id and groupId)
  const getGroupId = (group) => group.groupId;

  // Add group from dropdown
  const handleAddGroup = (groupId) => {
    const id = Number(groupId);
    if (!id || formData.groupIds.includes(id)) return;
    setFormData((prev) => ({
      ...prev,
      groupIds: [...prev.groupIds, id],
      isPublic: false,
    }));
  };

  // Remove group from selected list
  const handleRemoveGroup = (groupId) => {
    setFormData((prev) => ({
      ...prev,
      groupIds: prev.groupIds.filter((id) => id !== groupId),
    }));
  };

  // Handle public toggle
  const handlePublicToggle = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isPublic: checked,
      groupIds: checked ? [] : prev.groupIds, // Clear groups if public
    }));
  };

  // Get groups that are not yet selected (for dropdown)
  const availableGroups = groups.filter((group) => !formData.groupIds.includes(group.groupId));

  // Get selected group objects for display
  const selectedGroups = groups.filter((group) => formData.groupIds.includes(group.groupId));

  // Validation: must be public OR have at least one group selected
  const isAccessValid = formData.isPublic || formData.groupIds.length > 0;

  const handleNextStep = () => {
    const { fields, messages } = validateFields(['name', 'capacity'], formData);

    if (fields.length > 0) {
      setErrorForm({ fields, messages });
      return;
    }

    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timeslots = [];
    DAYS.forEach(day => {
      const setting = timeslotSettings[day];
      if (setting?.status) {
        timeslots.push({
          dayType: day,
          startTime: setting.startTime,
          endTime: setting.endTime
        });
      }
    });

    const submitData = {
      name: formData.name,
      description: formData.description,
      status: formData.status ? "open" : "closed",
      capacity: formData.capacity,
      isPublic: formData.isPublic,
      groupIds: formData.groupIds,
      timeslots: timeslots,
      intervalMins: String(interval),
    };

    // if (editingRoom) {
    //   const result = await dispatch(editRoom(editingRoom.roomId, submitData));
    //   if (result.success) handleCloseModal();
    // } else {
    // if (errorMessages.length > 0 || errorFields.length > 0) {
    //   const result = await dispatch(createRoom(submitData));
    //   if (result.success) handleCloseModal();
    // }}
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    dispatch(deleteRoom(roomId));
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Manage Rooms</CardTitle>
              <CardDescription>Add, edit, or remove meeting rooms</CardDescription>
            </div>
            <Button onClick={() => handleOpenModal()}>Add Room</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading rooms...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Capacity</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{room.name}</td>
                        <td className="p-3">{room.capacity} </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(room)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.roomId)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-6">
            <Card className={currentStep === 1 ? "w-[450px]" : "w-[900px] max-h-[90vh] overflow-auto"}>
              <CardHeader>
                <CardTitle>{editingRoom ? "Edit Room" : "Add Room"} - Step {currentStep} of 2</CardTitle>
                <CardDescription>
                  {currentStep === 1 ? "" : "Available Timeslots"}
                </CardDescription>
              </CardHeader>

              {currentStep === 1 && (
                <>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <FormInput
                        id="name"
                        label="Room Name"
                        value={formData.name}
                        error={_.includes(errorForm.fields, 'name') ? errorForm.messages[0] : ''}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setErrorForm(prev => ({ ...prev, fields: prev.fields.filter(f => f !== 'name') }));
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter room description..." />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FormInput
                          id="capacity"
                          label="Capacity"
                          type="number"
                          min="1"
                          value={formData.capacity}
                          error={_.includes(errorForm.fields, 'capacity') ? errorForm.messages[0] : ''}
                          onChange={(e) => {
                            setFormData({ ...formData, capacity: e.target.value });
                            setErrorForm(prev => ({ ...prev, fields: prev.fields.filter(f => f !== 'capacity') }));
                          }}
                          required
                          className="w-20"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Label>Status</Label>
                      <Input
                        type="checkbox"
                        id="status"
                        checked={formData.isOpen}
                        onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 ml-2"
                      />
                      <Label htmlFor="status" className="cursor-pointer font-normal">
                        Open
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Access Settings</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose whether this room is open to everyone or restricted to specific groups.
                      </p>

                      <div className="flex items-center gap-4 py-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="accessType"
                            checked={formData.isPublic}
                            onChange={() => handlePublicToggle(true)}
                            className="w-4 h-4 border-gray-300"
                          />
                          <span className="text-sm font-normal">Public (accessible to all users)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="accessType"
                            checked={!formData.isPublic}
                            onChange={() => handlePublicToggle(false)}
                            className="w-4 h-4 border-gray-300"
                          />
                          <span className="text-sm font-normal">Specific groups</span>
                        </label>
                      </div>

                      <Label className={`text-sm ${formData.isPublic ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                        Allowed Groups
                      </Label>
                      <div className={`border rounded-md max-h-48 overflow-y-auto divide-y ${formData.isPublic ? 'opacity-50 pointer-events-none' : ''}`}>
                        {groups.map((group) => (
                          <label
                            key={group.groupId}
                            htmlFor={`group-${group.groupId}`}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              id={`group-${group.groupId}`}
                              disabled={formData.isPublic}
                              checked={formData.groupIds.includes(group.groupId)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleAddGroup(group.groupId);
                                } else {
                                  handleRemoveGroup(group.groupId);
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm">{group.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                    <Button type="button" disabled={!isAccessValid} onClick={handleNextStep}>Next</Button>
                  </CardFooter>
                </>
              )}

              {/* Step 2: Timeslots */}
              {currentStep === 2 && (
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {/* Settings Row */}
                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-md flex-wrap">
                      <div className="flex items-center gap-2">
                        <Label>Booking Interval:</Label>
                        <select
                          className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                          value={interval}
                          onChange={(e) => setInterval(Number(e.target.value))}
                        >
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleApplyWorkingHours}>
                        Apply working hours (09:00-17:00)
                      </Button>
                    </div>

                    {/* Days Schedule */}
                    <div className="space-y-3">
                      {DAYS.map(day => (
                        <div key={day} className="flex items-center gap-4 p-3 border rounded-md">
                          <div className="w-28">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={timeslotSettings[day]?.status || false}
                                onChange={() => handleDayToggle(day)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <span className="font-medium">{day}</span>
                            </label>
                          </div>

                          {timeslotSettings[day]?.status && (
                            <div className="flex items-center gap-2">
                              <Label className="text-sm text-muted-foreground">From</Label>
                              <select
                                className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                                value={timeslotSettings[day]?.startTime || "09:00"}
                                onChange={(e) => handleTimeChange(day, "startTime", e.target.value)}
                              >
                                {HOURS_OPTIONS.map(hour => (
                                  <option key={hour} value={hour}>{hour}</option>
                                ))}
                              </select>
                              <Label className="text-sm text-muted-foreground">To</Label>
                              <select
                                className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                                value={timeslotSettings[day]?.endTime || "18:00"}
                                onChange={(e) => handleTimeChange(day, "endTime", e.target.value)}
                              >
                                {HOURS_OPTIONS.map(hour => (
                                  <option key={hour} value={hour}>{hour}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {!timeslotSettings[day]?.status && (
                            <span className="text-sm text-muted-foreground">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>Back</Button>
                    <Button type="submit">{editingRoom ? "Update" : "Create"}</Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

export default ManageRooms;
