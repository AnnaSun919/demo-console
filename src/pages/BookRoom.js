import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { fetchAvailableRooms, fetchAvailableTimeslots, bookRoom, resetBookRoom } from "../actions/BookRoom";
import moment from "moment";
import LocalStorageHelper from '../helper/local_storage_helper';

const BookRoom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { availableRooms, availableSlots, isLoading, bookingSuccess } = useSelector((state) => state.bookRoom);

  // Step management: 1 = select facility, 2 = select timeslot
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Search and select facility
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Step 2: Select date and timeslots
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available rooms on mount
  useEffect(() => {
    const user = LocalStorageHelper.getUserInfo();
    dispatch(fetchAvailableRooms({ userId: user.id }));
    return () => {
      dispatch(resetBookRoom());
    };
  }, [dispatch]);

  // Fetch available slots when room and date change
  useEffect(() => {
    if (selectedRoom && selectedDate) {
      dispatch(fetchAvailableTimeslots(selectedRoom.roomId, selectedDate));
      setSelectedSlots([]);
    }
  }, [selectedRoom, selectedDate, dispatch]);

  // Handle booking success
  useEffect(() => {
    if (bookingSuccess) {
      navigate("/my-bookings");
    }
  }, [bookingSuccess, navigate]);

  // Filter rooms based on search query
  const filteredRooms = availableRooms.filter((room) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      room.name?.toLowerCase().includes(query) ||
      room.location?.toLowerCase().includes(query) ||
      room.description?.toLowerCase().includes(query)
    );
  });

  // Format slot display - handle backend format: { date, slotStart, slotEnd, available }
  const formatSlotDisplay = (slot) => {
    if (typeof slot === 'string') {
      return slot;
    }
    // Backend format: { slotStart: "09:00", slotEnd: "10:00" }
    if (slot.slotStart && slot.slotEnd) {
      return `${slot.slotStart} - ${slot.slotEnd}`;
    }
    // Fallback formats
    if (slot.startTime) {
      return `${moment(slot.startTime).format("HH:mm")} - ${moment(slot.endTime).format("HH:mm")}`;
    }
    if (slot.time) {
      return slot.time;
    }
    return JSON.stringify(slot);
  };

  // Get slot identifier for selection - use slotStart + slotEnd as unique key
  const getSlotId = (slot) => {
    if (typeof slot === 'string') return slot;
    if (slot.id) return slot.id;
    // Backend format uses slotStart + slotEnd
    if (slot.slotStart && slot.slotEnd) {
      return `${slot.date || selectedDate}_${slot.slotStart}_${slot.slotEnd}`;
    }
    if (slot.startTime) return slot.startTime;
    return JSON.stringify(slot);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentStep(2);
    setSelectedDate("");
    setSelectedSlots([]);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setSelectedRoom(null);
    setSelectedDate("");
    setSelectedSlots([]);
  };

  const handleSlotClick = (slot) => {
    // Don't allow selecting unavailable slots
    if (slot.available === false) return;

    const slotId = getSlotId(slot);

    setSelectedSlots((prev) => {
      const isAlreadySelected = prev.some(s => getSlotId(s) === slotId);
      if (isAlreadySelected) {
        return prev.filter((s) => getSlotId(s) !== slotId);
      }
      return [...prev, slot];
    });
  };

  const getSlotClassName = (slot) => {
    const slotId = getSlotId(slot);
    const isSelected = selectedSlots.some(s => getSlotId(s) === slotId);
    const isUnavailable = slot.available === false;
    const baseClass = "p-3 text-center text-sm rounded transition-colors";

    // Unavailable - grey and not clickable
    if (isUnavailable) {
      return `${baseClass} bg-gray-200 text-gray-400 cursor-not-allowed line-through`;
    }
    // Selected - green
    if (isSelected) {
      return `${baseClass} bg-green-500 text-white cursor-pointer`;
    }
    // Available - default with hover
    return `${baseClass} bg-muted hover:bg-muted/80 cursor-pointer`;
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !selectedDate || selectedSlots.length === 0) return;

    setIsSubmitting(true);

    // Prepare booking data - send selected slots with their slotStart/slotEnd
    const bookingData = {
      roomId: selectedRoom.roomId || selectedRoom.id,
      date: selectedDate,
      slots: selectedSlots.map(slot => ({
        date: slot.date || selectedDate,
        slotStart: slot.slotStart,
        slotEnd: slot.slotEnd,
      })),
    };

    const result = await dispatch(bookRoom(bookingData));
    setIsSubmitting(false);

    if (result?.success) {
      navigate("/my-bookings");
    }
  };

  const today = moment().format("YYYY-MM-DD");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-white text-indigo-600' : 'bg-white/30'}`}>
              1
            </div>
            <span className="font-medium">Select Facility</span>
          </div>
          <div className="w-12 h-0.5 bg-white/30"></div>
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-white' : 'text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-white text-indigo-600' : 'bg-white/30'}`}>
              2
            </div>
            <span className="font-medium">Select Timeslot</span>
          </div>
        </div>

        {/* Step 1: Search and Select Facility */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Select a Facility</CardTitle>
              <CardDescription>
                Search and choose a room to book
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Facilities</Label>
                <Input
                  id="search"
                  placeholder="Search by name, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Room List */}
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Loading facilities...</p>
              ) : filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRooms.map((room) => (
                    <Card
                      key={room.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-indigo-500"
                      onClick={() => handleSelectRoom(room)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        {room.location && (
                          <p className="text-sm text-muted-foreground">Location: {room.location}</p>
                        )}
                        {room.capacity && (
                          <p className="text-sm text-muted-foreground">Capacity: {room.capacity} people</p>
                        )}
                        {room.description && (
                          <p className="text-sm text-muted-foreground mt-2">{room.description}</p>
                        )}
                        <Button className="mt-3 w-full" size="sm">
                          Select This Room
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No facilities found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Select Date and Timeslot */}
        {currentStep === 2 && selectedRoom && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Select Timeslot</CardTitle>
              <CardDescription>
                Choose a date and time for <strong>{selectedRoom.name}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Room Info */}
              <Card className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{selectedRoom.name}</h4>
                      {selectedRoom.capacity && (
                        <p className="text-sm text-muted-foreground">Capacity: {selectedRoom.capacity}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleBackToStep1}>
                      Change Room
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={today}
                />
              </div>

              {/* Time Slot Grid */}
              {selectedDate && (
                <div className="space-y-2">
                  <Label>Available Time Slots</Label>
                  {isLoading ? (
                    <p className="text-muted-foreground">Loading available slots...</p>
                  ) : availableSlots && availableSlots.length > 0 ? (
                    <>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {availableSlots.map((slot, index) => (
                          <div
                            key={getSlotId(slot) || index}
                            className={getSlotClassName(slot)}
                            onClick={() => handleSlotClick(slot)}
                          >
                            {formatSlotDisplay(slot)}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-muted rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <span>Unavailable</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 bg-muted rounded-md">
                      <p className="text-muted-foreground">No available time slots for this date</p>
                      <p className="text-sm text-muted-foreground mt-1">Please try another date</p>
                    </div>
                  )}
                </div>
              )}

              {/* Booking Summary */}
              {selectedSlots.length > 0 && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <p className="font-medium text-green-800">Booking Summary</p>
                    <p className="text-sm text-green-700">Room: {selectedRoom.name}</p>
                    <p className="text-sm text-green-700">Date: {selectedDate}</p>
                    <p className="text-sm text-green-700">
                      Selected Slots: {selectedSlots.length}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedSlots.map((slot, index) => (
                        <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                          {formatSlotDisplay(slot)}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={handleBackToStep1}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedDate || selectedSlots.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookRoom;
