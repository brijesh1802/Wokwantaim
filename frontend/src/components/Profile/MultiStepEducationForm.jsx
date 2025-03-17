import { useState } from "react";

const EDUCATION_LEVELS = {
  SSLC: "SSLC/10th",
  PUC: "PUC/12th/Higher Secondary",
  BACHELORS: "Bachelor's Degree",
  MASTERS: "Master's Degree",
};

const MultiStepEducationForm = ({
  toggleForm,
  updateParentState,
  data,
  setData,
}) => {
  const [loading, setLoading] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const token = localStorage.getItem("authToken");
  const [confirmOverride, setConfirmOverride] = useState(false);
  const [error, setError] = useState(null);

  const [currentQualification, setCurrentQualification] = useState({
    id: "",
    level: "",
    institution: "",
    fieldOfStudy: "",
    yearOfStart: "",
    yearOfCompletion: "",
    percentage: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleInputChange = (field, value) => {
    setCurrentQualification((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateDates = (newQualification) => {
    if (
      parseInt(newQualification.yearOfStart) >=
      parseInt(newQualification.yearOfCompletion)
    ) {
      return "Start year must be less than end year";
    }

    const orderedLevels = ["SSLC", "PUC", "BACHELORS", "MASTERS"];

    // Add new qualification and sort based on start year
    const allQualifications = [...qualifications, newQualification].sort(
      (a, b) => parseInt(a.yearOfStart) - parseInt(b.yearOfStart)
    );

    let prevCompletionYear = 0;

    for (let i = 0; i < allQualifications.length; i++) {
      let current = allQualifications[i];

      if (parseInt(current.yearOfStart) < prevCompletionYear) {
        return `Start year of ${current.level} (${current.yearOfStart}) must be after completion of a previous degree (${prevCompletionYear})`;
      }

      prevCompletionYear = parseInt(current.yearOfCompletion);
    }

    return null;
  };

  const fetchExistingEducation = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch education data");

      const result = await response.json();
      return result.education || [];
    } catch (error) {
      console.error("Error fetching education:", error);
      return [];
    }
  };

  const addQualification = async () => {
    if (
      !currentQualification.level ||
      !currentQualification.institution ||
      !currentQualification.fieldOfStudy ||
      !currentQualification.percentage ||
      !currentQualification.yearOfStart ||
      !currentQualification.yearOfCompletion
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Fetch latest education records from the database
    const existingEducation = await fetchExistingEducation();

    // Check if the qualification already exists
    if (
      existingEducation.some((q) => q.degree === currentQualification.level)
    ) {
      setError(
        `You've already added ${
          EDUCATION_LEVELS[currentQualification.level]
        } qualification`
      );
      return;
    }

    const validationError = validateDates(currentQualification);
    if (validationError) {
      setError(validationError);
      return;
    }

    setQualifications([
      ...qualifications,
      { ...currentQualification, id: Date.now().toString() },
    ]);

    setCurrentQualification({
      id: "",
      level: "",
      institution: "",
      fieldOfStudy: "",
      yearOfStart: "",
      yearOfCompletion: "",
      percentage: "",
    });
  };

  const removeQualification = (id) => {
    setQualifications(qualifications.filter((q) => q.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const existingEducation = await fetchExistingEducation();

    const newEducation = qualifications.map((q) => ({
      institution: q.institution,
      degree: q.level,
      grade: q.percentage,
      startDate: q.yearOfStart,
      endDate: q.yearOfCompletion,
      description: q.fieldOfStudy,
    }));

    const existingLevels = existingEducation.map((edu) => edu.degree);
    const newLevels = newEducation.map((edu) => edu.degree);
    const duplicateLevels = newLevels.filter((level) =>
      existingLevels.includes(level)
    );

    if (duplicateLevels.length > 0 && !confirmOverride) {
      setError(
        `The following qualification(s) already exist: ${duplicateLevels.join(
          ", "
        )}. Clicking save again will override the data.`
      );
      setConfirmOverride(true);
      setLoading(false);
      return;
    }

    const filteredOldEducation = existingEducation.filter(
      (edu) => !newLevels.includes(edu.degree)
    );

    const updatedEducation = [...filteredOldEducation, ...newEducation];

    const payload = {
      ...data,
      education: updatedEducation,
    };

    try {
      const updateUrl = `${
        import.meta.env.VITE_BASE_URL
      }/api/v1/candidates/info/update`;

      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update education");

      const updatedData = await response.json();
      setData((prevData) => ({ ...prevData, education: updatedEducation }));

      updateParentState(updatedData);
      toggleForm();
      setConfirmOverride(false);
    } catch (error) {
      setError("Failed to update education");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Education Details</h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {qualifications.length > 0 && (
          <div className="space-y-4 mb-4">
            {qualifications.map((q) => (
              <div
                key={q.id}
                className="p-4 border rounded-md shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{EDUCATION_LEVELS[q.level]}</p>
                  <p>Institution : {q.institution}</p>
                  <p>Field : {q.fieldOfStudy}</p>
                  <p>Start : {q.yearOfStart}</p>
                  <p>End : {q.yearOfCompletion}</p>
                  <p>Percentage : {q.percentage}</p>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => removeQualification(q.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <select
            className="border p-2 w-full"
            value={currentQualification.level}
            onChange={(e) => handleInputChange("level", e.target.value)}
          >
            <option value="">Select Level</option>
            {Object.entries(EDUCATION_LEVELS).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Institution"
            value={currentQualification.institution}
            onChange={(e) => handleInputChange("institution", e.target.value)}
          />
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Field of Study"
            value={currentQualification.fieldOfStudy}
            onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
          />
          <select
            className="border p-2 w-full"
            value={currentQualification.yearOfStart}
            onChange={(e) => handleInputChange("yearOfStart", e.target.value)}
          >
            <option value="">Select Start Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="border p-2 w-full"
            value={currentQualification.yearOfCompletion}
            onChange={(e) =>
              handleInputChange("yearOfCompletion", e.target.value)
            }
          >
            <option value="">Select Completion Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Percentage/CGPA"
            value={currentQualification.percentage}
            onChange={(e) => handleInputChange("percentage", e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
          onClick={addQualification}
        >
          Add Qualification
        </button>

        {qualifications.length > 0 && (
          <button
            className="w-full bg-green-500 text-white p-2 rounded-md mt-4"
            onClick={handleSave}
          >
            Submit All
          </button>
        )}
        <button
          className="w-full bg-gray-400 text-white p-2 rounded-md mt-4"
          onClick={toggleForm}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MultiStepEducationForm;
