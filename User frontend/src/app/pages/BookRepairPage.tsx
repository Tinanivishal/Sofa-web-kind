import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Upload,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { createRepairBooking } from '../api/repairs';

const repairTypes = [
  {
    id: 'foam',
    name: 'Foam Replacement',
    description: 'Replace worn-out cushion foam',
    price: 150,
    icon: '🛋️',
  },
  {
    id: 'fabric',
    name: 'Fabric Change',
    description: 'Complete upholstery fabric replacement',
    price: 350,
    icon: '🎨',
  },
  {
    id: 'spring',
    name: 'Spring Repair',
    description: 'Fix or replace damaged springs',
    price: 200,
    icon: '🔧',
  },
  {
    id: 'restoration',
    name: 'Full Sofa Restoration',
    description: 'Complete refurbishment of your sofa',
    price: 600,
    icon: '✨',
  },
];

const timeSlots = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
];

export const BookRepairPage = () => {
  const [step, setStep] = useState(1);
  const [selectedRepair, setSelectedRepair] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const { addRepairBooking, isLoggedIn, openAuthModal } = useApp();
  const navigate = useNavigate();

  const selectedRepairType = repairTypes.find(r => r.id === selectedRepair);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image upload - in real app, upload to server
      const mockUrls = Array.from(files).map((file, index) =>
        URL.createObjectURL(file)
      );
      setUploadedImages(prev => [...prev, ...mockUrls]);
      toast.success(`${files.length} image(s) uploaded`);
    }
  };

  const handleConfirmBooking = () => {
    if (!isLoggedIn) {
      openAuthModal('register');
      return;
    }

    createRepairBooking({
      repairType: 'OTHER',
      description: selectedRepairType?.name || 'Sofa repair',
      bookingDate: new Date(selectedDate).toISOString(),
      slot: selectedTime,
      estimatedCost: selectedRepairType?.price,
    })
      .then(apiBooking => {
        const booking = {
          id: apiBooking.id,
          type: apiBooking.repairType,
          date: new Date(apiBooking.bookingDate).toLocaleDateString(),
          time: apiBooking.slot,
          address: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
          status: apiBooking.status as const,
          estimatedCost:
            typeof apiBooking.estimatedCost === 'string'
              ? Number(apiBooking.estimatedCost)
              : apiBooking.estimatedCost ?? selectedRepairType?.price ?? 0,
          images: uploadedImages,
        };

        addRepairBooking(booking);
        setStep(6);
        toast.success('Booking confirmed!');
      })
      .catch(error => {
        console.error(error);
        toast.error('Failed to create booking. Please try again.');
      });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedRepair !== '';
      case 2:
        return uploadedImages.length > 0;
      case 3:
        return selectedDate !== '';
      case 4:
        return selectedTime !== '';
      case 5:
        return (
          address.street &&
          address.city &&
          address.state &&
          address.zip &&
          address.phone
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceed()) {
      setStep(step + 1);
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const prevStep = () => {
    setStep(Math.max(1, step - 1));
  };

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Sofa Repair Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional repair at your doorstep
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Service</span>
            <span>Images</span>
            <span>Date</span>
            <span>Time</span>
            <span>Address</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Repair Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Select Repair Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {repairTypes.map(repair => (
                    <button
                      key={repair.id}
                      onClick={() => setSelectedRepair(repair.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedRepair === repair.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{repair.icon}</div>
                      <h3 className="font-semibold mb-2">{repair.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {repair.description}
                      </p>
                      <div className="text-lg font-bold text-primary">
                        Starting at ${repair.price}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Upload Images */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Upload Sofa Images
                </h2>
                <p className="text-muted-foreground mb-6">
                  Upload photos of your sofa to help us assess the repair
                  needed
                </p>

                <label className="block border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="font-semibold mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {uploadedImages.length > 0 && (
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {uploadedImages.map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Select Date */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Select Date</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {generateDates().map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedDate === dateStr
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-sm text-muted-foreground mb-1">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </div>
                        <div className="font-semibold">
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Select Time Slot */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Select Time Slot</h2>
                <div className="space-y-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                        selectedTime === slot
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{slot}</span>
                      </div>
                      {selectedTime === slot && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Enter Address */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Enter Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={e =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input-background focus:border-primary outline-none"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={e =>
                          setAddress({ ...address, city: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input-background focus:border-primary outline-none"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={e =>
                          setAddress({ ...address, state: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input-background focus:border-primary outline-none"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={address.zip}
                        onChange={e =>
                          setAddress({ ...address, zip: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input-background focus:border-primary outline-none"
                        placeholder="10001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={e =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input-background focus:border-primary outline-none"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                    <h3 className="font-semibold mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="font-semibold">
                          {selectedRepairType?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-semibold">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">
                          Estimated Cost:
                        </span>
                        <span className="text-xl font-bold text-primary">
                          ${selectedRepairType?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your repair service has been scheduled successfully
                </p>

                <div className="bg-muted/50 rounded-xl p-6 mb-8">
                  <div className="text-sm text-muted-foreground mb-2">
                    Booking ID
                  </div>
                  <div className="text-2xl font-bold text-primary mb-6">
                    BK{Date.now()}
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <Wrench className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Service
                        </div>
                        <div className="font-semibold">
                          {selectedRepairType?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Date & Time
                        </div>
                        <div className="font-semibold">
                          {selectedDate} at {selectedTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Address
                        </div>
                        <div className="font-semibold">
                          {address.street}, {address.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold"
                  >
                    Track Your Booking
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-3 border-2 border-border hover:border-primary rounded-lg font-semibold transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {step < 6 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-border hover:border-primary rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <button
                onClick={step === 5 ? handleConfirmBooking : nextStep}
                disabled={!canProceed()}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center gap-2"
              >
                {step === 5 ? 'Confirm Booking' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
