import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/Profile/ProfileCard";
import EditableSection from "../components/Profile/EditableSection";
import ProfileSection from "../components/Profile/ProfileSection";
import Certifications from "../components/Profile/Certifications";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Popup from "../components/Profile/Popup";
import SocialLinks from "../components/Profile/SocialLinks";
import EducationSection from "../components/Profile/EducationSection";
import SkillSection from "../components/Profile/SkillSection";
import ExperienceSection from "../components/Profile/ExperienceSection";

// Utility functions for local storage handling
const updateLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(
      `Error parsing data from localStorage for key: ${key}`,
      error
    );
    return defaultValue;
  }
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: getFromLocalStorage("linkedin", ""),
    github: getFromLocalStorage("github", ""),
  });
  const [certifications, setCertifications] = useState(
    getFromLocalStorage("certifications", [])
  );
  const [educations, setEducations] = useState(
    getFromLocalStorage("educations", [])
  );
  const [skills, setSkills] = useState(getFromLocalStorage("skills", []));
  const [experiences, setExperiences] = useState(
    getFromLocalStorage("experiences", [])
  );
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState(socialLinks.linkedin);
  const [githubUrl, setGithubUrl] = useState(socialLinks.github);
  const [isSocialLinksVisible, setIsSocialLinksVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupData, setPopupData] = useState({
    linkedin: linkedinUrl,
    github: githubUrl,
    name: "",
    link: "",
    issuedDate: "",
    grade: "",
    fromDate: "",
    toDate: "",
    skill: "",
    proficiency: "",
    company: "",
    role: "",
    industry: "",
    index: null,
  });

  const { userType } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  const [aboutMe, setAboutMe] = useState(getFromLocalStorage("aboutMe", ""));
  const [experienceContentExists, setExperienceContentExists] = useState(false);
  const [skillsContentExists, setSkillsContentExists] = useState(false);
  const [educationContentExists, setEducationContentExists] = useState(false);

  useEffect(() => {
    if (!token) {
      console.error("No authentication token found.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const url =
          userType === "candidate"
            ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/profile`
            : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/profile`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);

        // Set content existence flags based on the data
        setExperienceContentExists(!!data.experience);
        setEducationContentExists(!!data.education);
        setSkillsContentExists(!!data.skills);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userType) fetchUserProfile();
  }, [userType, token]);

  // Update educationContentExists whenever educations state changes
  useEffect(() => {
    setEducationContentExists(educations.length > 0);
  }, [educations]);

  // Update skillsContentExists whenever skills state changes
  useEffect(() => {
    setSkillsContentExists(skills.length > 0);
  }, [skills]);

  // Update experienceContentExists whenever experiences state changes
  useEffect(() => {
    setExperienceContentExists(experiences.length > 0);
  }, [experiences]);

  // Generalized save functions
  const handleSaveAbout = () => {
    updateLocalStorage("aboutMe", aboutMe);
    setUser((prevUser) => ({ ...prevUser, about: aboutMe }));
  };

  const handleSaveSocialLinks = () => {
    const updatedLinks = {
      linkedin: popupData.linkedin,
      github: popupData.github,
    };
    setSocialLinks(updatedLinks);
    updateLocalStorage("linkedin", popupData.linkedin);
    updateLocalStorage("github", popupData.github);
    setShowPopup(false);
  };

  const handleSaveCertification = () => {
    if (popupData.index !== null) {
      // Editing an existing certification
      const updatedCertifications = [...certifications];
      updatedCertifications[popupData.index] = {
        name: popupData.name,
        link: popupData.link,
        issuedDate: popupData.issuedDate,
      };
      setCertifications(updatedCertifications);
      updateLocalStorage("certifications", updatedCertifications);
    } else {
      // Adding a new certification
      const updatedCertifications = [
        ...certifications,
        {
          name: popupData.name,
          link: popupData.link,
          issuedDate: popupData.issuedDate,
        },
      ];
      setCertifications(updatedCertifications);
      updateLocalStorage("certifications", updatedCertifications);
    }

    setShowPopup(false);
  };

  const handleSaveEducation = () => {
    // Log popupData to ensure it's correctly populated
    console.log(popupData);

    // Validate the date fields
    if (new Date(popupData.fromDate) > new Date(popupData.toDate)) {
      alert("From date cannot be later than To date");
      return; // Prevent saving if the dates are invalid
    }

    let updatedEducations;
    if (popupData.index !== null && popupData.index !== undefined) {
      // Editing an existing education entry
      updatedEducations = [...educations];
      updatedEducations[popupData.index] = {
        name: popupData.name,
        grade: popupData.grade,
        fromDate: popupData.fromDate,
        toDate: popupData.toDate,
      };
    } else {
      // Adding a new education entry
      updatedEducations = [
        ...educations,
        {
          name: popupData.name,
          grade: popupData.grade,
          fromDate: popupData.fromDate,
          toDate: popupData.toDate,
        },
      ];
    }

    // Update the educations state and localStorage
    setEducations(updatedEducations);
    updateLocalStorage("educations", updatedEducations);

    // Close the popup
    setShowPopup(false);
  };

  const handleSaveExperience = () => {
    // Log popupData to ensure it's correctly populated
    console.log(popupData);

    // Validate the date fields
    if (new Date(popupData.fromDate) > new Date(popupData.toDate)) {
      alert("From date cannot be later than To date");
      return; // Prevent saving if the dates are invalid
    }

    let updatedExperiences;
    if (popupData.index !== null && popupData.index !== undefined) {
      // Editing an existing experience entry
      updatedExperiences = [...experiences];
      updatedExperiences[popupData.index] = {
        company: popupData.company,
        role: popupData.role,
        industry: popupData.industry,
        fromDate: popupData.fromDate,
        toDate: popupData.toDate,
      };
    } else {
      // Adding a new experience entry
      updatedExperiences = [
        ...experiences,
        {
          company: popupData.company,
          role: popupData.role,
          industry: popupData.industry,
          fromDate: popupData.fromDate,
          toDate: popupData.toDate,
        },
      ];
    }

    // Update the experiences state and localStorage
    setExperiences(updatedExperiences);
    updateLocalStorage("experiences", updatedExperiences);

    // Close the popup
    setShowPopup(false);
  };

  useEffect(() => {
    const storedEducations =
      JSON.parse(localStorage.getItem("educations")) || [];
    setEducations(storedEducations);
  }, []);

  useEffect(() => {
    const storedExperiences =
      JSON.parse(localStorage.getItem("experiences")) || [];
    setExperiences(storedExperiences);
  }, []);

  useEffect(() => {
    const storedSkills = JSON.parse(localStorage.getItem("skills")) || [];
    setSkills(storedSkills);
  }, []);

  useEffect(() => {
    console.log("Educations state updated:", educations);
  }, [educations]);

  useEffect(() => {
    console.log("Experiences state updated:", experiences);
  }, [experiences]);

  useEffect(() => {
    console.log("Skills state updated:", skills);
  }, [skills]);

  const handleSaveSkills = () => {
    if (popupData.index !== null) {
      // Editing an existing skills entry
      const updatedSkills = [...skills];
      updatedSkills[popupData.index] = {
        skill: popupData.skill,
        proficiency: popupData.proficiency,
      };
      setSkills(updatedSkills);
      updateLocalStorage("skills", updatedSkills);
    } else {
      // Adding a new skills entry
      const updatedSkills = [
        ...skills,
        {
          skill: popupData.skill,
          proficiency: popupData.proficiency,
        },
      ];
      setSkills(updatedSkills);
      updateLocalStorage("skills", updatedSkills);
    }

    setShowPopup(false);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddExperience = () => {
    setPopupType("Experience");
    setPopupData({
      company: "",
      role: "",
      industry: "",
      fromDate: "",
      toDate: "",
      index: null,
    });
    togglePopup();
  };

  const handleAddEducation = () => {
    setPopupType("Education");
    setPopupData({
      name: "",
      grade: "",
      fromDate: "",
      toDate: "",
      index: null,
    });
    togglePopup();
  };

  const handleAddSkills = () => {
    setPopupType("Skills");
    setPopupData({ skill: "", proficiency: "", index: null });
    togglePopup();
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Error message="User not found. Please log in." />;
  }

  return (
    <div className="mx-auto px-4 flex h-full w-full mb-10 mt-2">
      <div className="flex h-96 mt-10 sticky top-0">
        <ProfileCard user={user} />
      </div>

      <div className="flex flex-col w-full ml-4 mr-4">
        <EditableSection
          user={user}
          title="About Me"
          content={aboutMe}
          onSave={handleSaveAbout}
          setContent={setAboutMe}
        />

        <ProfileSection
          title="Experience"
          onAdd={handleAddExperience}
          contentExists={experienceContentExists}
        >
          {experienceContentExists ? (
            <ExperienceSection
              experiences={experiences}
              setExperiences={setExperiences}
              togglePopup={togglePopup}
              setPopupType={setPopupType}
              setPopupData={setPopupData}
            />
          ) : (
            <p className="text-gray-500">
              No experience details available. Add your experience here.
            </p>
          )}
        </ProfileSection>

        <ProfileSection
          title="Education"
          onAdd={handleAddEducation}
          contentExists={educationContentExists}
        >
          {educationContentExists ? (
            <EducationSection
              educations={educations}
              setEducations={setEducations}
              togglePopup={togglePopup}
              setPopupType={setPopupType}
              setPopupData={setPopupData}
            />
          ) : (
            <p className="text-gray-500">
              No education details available. Add your education here.
            </p>
          )}
        </ProfileSection>

        <ProfileSection
          title="Skills"
          onAdd={handleAddSkills}
          contentExists={skillsContentExists}
        >
          {skillsContentExists ? (
            <SkillSection
              skills={skills}
              setSkills={setSkills}
              togglePopup={togglePopup}
              setPopupType={setPopupType}
              setPopupData={setPopupData}
            />
          ) : (
            <p className="text-gray-500">
              No skills details available. Add your skills here.
            </p>
          )}
        </ProfileSection>

        <ProfileSection
          title="Certifications"
          onAdd={() => {
            setPopupType("Certification");
            setPopupData({
              name: "",
              link: "",
              issuedDate: "",
              index: null,
            });
            togglePopup();
          }}
          contentExists={certifications.length > 0}
        >
          <Certifications
            certifications={certifications}
            setCertifications={setCertifications}
            togglePopup={togglePopup}
            setPopupType={setPopupType}
            setPopupData={setPopupData}
          />
        </ProfileSection>

        <ProfileSection
          title="Social Links"
          onAdd={() => {
            setPopupType("Social Links");
            setPopupData({
              linkedin: socialLinks.linkedin,
              github: socialLinks.github,
              name: "",
              link: "",
              issuedDate: "",
            });
            togglePopup();
          }}
          contentExists={socialLinks.linkedin || socialLinks.github}
        >
          <div className="mt-10">
            {socialLinks.linkedin || socialLinks.github ? (
              <SocialLinks socialLinks={socialLinks} />
            ) : (
              <p className="text-gray-500">Add your social profiles here</p>
            )}
          </div>
        </ProfileSection>
      </div>

      {showPopup && (
        <Popup
          type={popupType}
          data={popupData}
          setData={setPopupData}
          handleSave={
            popupType === "Social Links"
              ? handleSaveSocialLinks
              : popupType === "Education"
              ? handleSaveEducation
              : popupType === "Skills"
              ? handleSaveSkills
              : popupType === "Experience"
              ? handleSaveExperience
              : handleSaveCertification
          }
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default Profile;
