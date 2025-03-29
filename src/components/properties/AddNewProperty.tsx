import React, { useState } from "react";
import PropertyInformation from "./PropertyInformation";
import PropertyLocation from "./PropertyLocation";
import RentCharges from "./RentCharges";
import PopupMessage from "./PopupMessage";

const AddNewProperty: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // To track success or failure

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Callback function to handle successful property creation
  const handlePropertyCreated = (message: string, isSuccess: boolean) => {
    setPopupMessage(message);
    setIsSuccess(isSuccess);
    setShowPopup(true);

    // Redirect to the specified path after 2 seconds if successful
    if (isSuccess) {
      setTimeout(() => {
        window.location.href = "http://localhost:5173/properties/all"; // Redirect to this exact path
      }, 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Property</h2>
      {step === 1 && <PropertyInformation onSubmit={nextStep} />}
      {step === 2 && <PropertyLocation onSubmit={nextStep} onBack={prevStep} />}
      {step === 3 && (
        <RentCharges
          onSubmit={nextStep}
          onBack={prevStep}
          onPropertyCreated={handlePropertyCreated} // Pass the callback
        />
      )}

      {/* Popup Message */}
      {showPopup && (
        <PopupMessage
          message={popupMessage}
          isSuccess={isSuccess}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default AddNewProperty;