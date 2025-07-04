import React, { useState } from "react";
import profile from "../../assets/profile.png";

function Profile() {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    role: ""
  });

  // Constants
  const colors = {
    background: "#FBFFF5",
    border: "#DDC7C7",
    editButton: "#F9CA9C",
    popupBackground: "#E0F2E9",
    successButton: "#15803D",
    green700: "#15803D",
    gray300: "#D1D5DB",
    blue500: "#3B82F6",
    slate600: "#475569"
  };

  const labels = {
    profileTitle: "Profile",
    personalInfo: "PERSONAL INFORMATION",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    contact: "Contact Number",
    role: "User role",
    edit: "Edit",
    uploadImage: "Upload Image",
    discard: "Discard",
    save: "Save",
    successTitle: "Successfully Saved!",
    ok: "OK",
    defaultName: "Edit to add name"
  };

  const dimensions = {
    profileImage: "w-25 h-25",
    inputWidths: {
      half: "w-1/2",
      third: "w-1/3"
    },
    containerWidth: "w-4/5"
  };

  const classNames = {
    header: "alignment-top-left text-3xl font-bold",
    profileName: "ml-5 text-xl font-bold",
    sectionTitle: "ml-2 text-xl font-medium",
    label: "text-slate-600 font-poppins mb-2",
    value: "font-poppins",
    input: "w-full p-2 border rounded-md mt-1",
    button: {
      edit: "px-5 py-2 text-sm font-medium rounded-md shadow",
      upload: "px-4 py-2 text-white rounded-md text-sm",
      action: "px-4 py-2 rounded-md",
      popup: "px-4 py-2 text-white rounded-md"
    },
    popupTitle: "text-lg font-semibold mb-4"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsSaved(true);
    setShowPopup(true);
  };

  return (
    <div
      className={`pl-5 h-full overflow-auto`}
      style={{ backgroundColor: colors.background }}
    >
      <div className="p-6 ml-0">
        <h1 className={classNames.header}>{labels.profileTitle}</h1>
      </div>

      {/* Profile Image Section */}
      <div
        className={`mt-5 ${dimensions.containerWidth} flex items-center justify-between border rounded-md p-4 mx-auto shadow-md`}
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center">
          <img
            src={profile}
            alt="User"
            className={`${dimensions.profileImage} rounded-full object-cover`}
          />
          <p className={classNames.profileName}>
            {isSaved ? `${formData.firstName} ${formData.lastName}` : labels.defaultName}
          </p>
        </div>

        {isEditing && (
          <button 
            className={classNames.button.upload}
            style={{ backgroundColor: colors.green700 }}
          >
            {labels.uploadImage}
          </button>
        )}
      </div>

      {/* Personal Info Section */}
      <div
        className={`mt-5 ${dimensions.containerWidth} flex flex-col border rounded-md py-8 px-4 mx-auto shadow-md`}
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center justify-between w-full">
          <p className={classNames.sectionTitle}>{labels.personalInfo}</p>
          <button
            className={classNames.button.edit}
            style={{ backgroundColor: colors.editButton }}
            onClick={() => setIsEditing(true)}
          >
            {labels.edit}
          </button>
        </div>

        {/* First + Last Name */}
        <div className="mx-2 mt-4 flex justify-between w-4/5">
          <div className={`${dimensions.inputWidths.half} pr-2`}>
            <p className={classNames.label}>{labels.firstName}</p>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={classNames.input}
              />
            ) : (
              <p className={`${classNames.value} font-medium`}>{formData.firstName}</p>
            )}
          </div>
          <div className={`${dimensions.inputWidths.half} pl-2`}>
            <p className={classNames.label}>{labels.lastName}</p>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={classNames.input}
              />
            ) : (
              <p className={`${classNames.value} font-medium`}>{formData.lastName}</p>
            )}
          </div>
        </div>

        {/* Email, Contact, Role */}
        <div className="mx-2 mt-10 flex justify-between w-4/5">
          <div className={`${dimensions.inputWidths.third} pr-2`}>
            <p className={classNames.label}>{labels.email}</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={classNames.input}
              />
            ) : (
              <p className={classNames.value}>{formData.email}</p>
            )}
          </div>
          <div className={`${dimensions.inputWidths.third} px-2`}>
            <p className={classNames.label}>{labels.contact}</p>
            {isEditing ? (
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={classNames.input}
              />
            ) : (
              <p className={classNames.value}>{formData.contact}</p>
            )}
          </div>
          <div className={`${dimensions.inputWidths.third} pl-2`}>
            <p className={classNames.label}>{labels.role}</p>
            <p className={classNames.value}>{formData.role}</p>
          </div>
        </div>

        {/* Save Confirmation Popup */}
        {showPopup && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="p-6 rounded-lg shadow-lg text-center"
              style={{ backgroundColor: colors.popupBackground }}
            >
              <h2 className={classNames.popupTitle}>
                {labels.successTitle}
              </h2>
              <button
                className={classNames.button.popup}
                style={{ backgroundColor: colors.successButton }}
                onClick={() => setShowPopup(false)}
              >
                {labels.ok}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-2 mt-6 pr-2">
            <button
              className={classNames.button.action}
              style={{ backgroundColor: colors.gray300 }}
              onClick={() => setIsEditing(false)}
            >
              {labels.discard}
            </button>
            <button
              className={classNames.button.action}
              style={{ backgroundColor: colors.blue500, color: "white" }}
              onClick={handleSave}
            >
              {labels.save}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;