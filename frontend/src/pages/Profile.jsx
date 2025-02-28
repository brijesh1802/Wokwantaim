import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/Profile/ProfileCard";
import { useNavigate } from "react-router-dom";
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
import DeleteAccount from "../components/DeleteAccount";
import LogoutConfirmation from "../components/LogoutConfirmation";
import PersonalProjects from "../components/Profile/PersonalProjects";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [deletemodal, setDeleteModal] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [personalProjects, setPersonalProjects] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupData, setPopupData] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    name: "",
    link: "",
    issuedDate: "",
    grade: "",
    fromDate: "",
    toDate: "",
    skill: "",
    company: "",
    role: "",
    industry: "",
    title: "",
    description: "",
    technologiesUsed: "",
    projectUrl: "",
    githubRepo: "",
    index: null,
  });
  const navigate = useNavigate();

  const { userType, logout } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const [experienceContentExists, setExperienceContentExists] = useState(false);
  const [educationContentExists, setEducationContentExists] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLoading(true);
    setLogoutConfirmOpen(false);
    console.log("Logging out...");
    setTimeout(() => {
      handleLogout();
      setLoading(false);
    }, 3000);
  };

  const handleLogoutCancel = () => {
    setLogoutConfirmOpen(false);
  };

  useEffect(() => {
    if (!token) {
      console.error("No authentication token found.");
      localStorage.clear();
      navigate("/");
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
        setUser(data.candidate || data.employer);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userType) fetchUserProfile();
  }, [userType, token]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const data = await response.json();

      setSkills(data.skills || []);
      setPersonalProjects(data.personalProjects || []);
      setSocialLinks(data.socialLinks || []);
    };

    fetchUserData();
  }, []);

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

  const updateParentState = (updatedData) => {
    setSkills(updatedData.skills || []);
    setPersonalProjects(updatedData.personalProjects || []);
    setSocialLinks(updatedData.socialLinks || []);
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Error message="User not found. Please log in." />;
  }

  return (
    <div className="mx-auto mt-12 px-4 flex flex-col lg:flex-row h-full w-full mb-2 sm:ml-4">
      <div className="flex flex-col items-center xl:items-start xl:ml-2 xl:px-5 lg:w-max xl:w-1/3 mt-10 xl:mt-5">
        <ProfileCard user={user} className="xl:ml-2 xl:mr-2" />
      </div>

      <div className="flex flex-col w-full lg:py-8 xl:w-2/3 mt-1 xl:mt-0 xl:mr-5 space-y-4">
        <EditableSection user={user} title="About Me" />
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
          contentExists={skills.length > 0}
          onAdd={() => {
            setPopupType("Skills");
            setPopupData({ skill: "" });
            togglePopup();
            /* Open popup */
          }}
        >
          <SkillSection skills={skills} setSkills={setSkills} />
        </ProfileSection>

        <ProfileSection
          title="Personal Projects"
          onAdd={() => {
            setPopupType("personalProjects");
            setPopupData({
              title: "",
              description: "",
              technologiesUsed: "",
              projectUrl: "",
              githubRepo: "",
              index: null,
            });
            togglePopup();
          }}
          contentExists={personalProjects.length > 0}
        >
          <PersonalProjects
            personalProjects={personalProjects}
            setPersonalProjects={setPersonalProjects}
          />
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
            setPopupType("socialLinks");
            setPopupData({
              linkedin: "",
              github: "",
              portfolio: "",
            });
            togglePopup();
          }
          }
          contentExists={socialLinks.length > 0}
        >
          <SocialLinks
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
          />
        </ProfileSection>

        <div className="p-4 flex flex-col bg-white rounded-lg shadow-lg w-full mt-5 items-center space-y-3">
          <button
            className="text-zinc-700 text-xl font-semibold hover:text-zinc-900 transition"
            onClick={() => setDeleteModal(true)}
          >
            Delete Account
          </button>
          <div className="w-full border-t border-gray-200"></div>{" "}
          {/* Separator */}
          <button
            className="text-white bg-red-500 px-5 py-2 text-lg rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
            onClick={handleLogoutConfirm}
          >
            Logout
          </button>
        </div>
      </div>

      {showPopup && (
        <Popup
          type={popupType}
          data={popupData}
          setData={setPopupData}
          togglePopup={togglePopup}
          updateParentState={updateParentState}
        />
      )}

      {deletemodal && <DeleteAccount onClose={() => setDeleteModal(false)} />}

      {logoutConfirmOpen && (
        <LogoutConfirmation
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
};

export default Profile;
