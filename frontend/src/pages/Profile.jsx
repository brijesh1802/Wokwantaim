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
import MultiStepEducationForm from "../components/Profile/MultiStepEducationForm";
import { FiLogOut, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";

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
  const [workExperience, setWorkExperience] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [popupType, setPopupType] = useState("");
  const { userType, logout } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const [popupData, setPopupData] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    degree: "",
    grade: "",
    institution: "",
    name: "",
    link: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialURL: "",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    skill: "",
    jobtitle: "",
    company: "",
    location: "",
    industry: "",
    title: "",
    description: "",
    technologiesUsed: "",
    projectUrl: "",
    githubRepo: "",
    index: null,
  });
  const navigate = useNavigate();

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
        setUser(data.candidate || data.employer || data);
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
      setCertifications(data.certifications || []);
      setWorkExperience(data.workExperience || []);
      setEducations(data.education || []);
    };
    if (userType === "candidate") fetchUserData();
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleEducationForm = () => {
    setShowEducationForm(!showEducationForm);
  };

  const updateParentState = (updatedData) => {
    setSkills(updatedData.skills || []);
    setPersonalProjects(updatedData.personalProjects || []);
    setSocialLinks(updatedData.socialLinks || []);
    setCertifications(updatedData.certifications || []);
    setWorkExperience(updatedData.workExperience || []);
    setEducations(updatedData.education || []);
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Error message="User not found. Please log in." />;
  }

  if (userType === "candidate" || userType === "undefined") {
    return (
      <div className="mx-auto mt-12 flex flex-col lg:flex-row h-full w-full mb-2 sm:ml-4 ">
        <div className="flex flex-col items-center xl:items-start xl:ml-2 xl:px-5 lg:w-max xl:w-1/3 mt-10 xl:mt-5">
          <ProfileCard user={user} className="xl:ml-2 xl:mr-2" />
        </div>

        <div className="flex flex-col w-full lg:py-8 xl:w-2/3 mt-1 xl:mt-0 xl:mr-5 space-y-4">
          <EditableSection user={user} title="About Me" />
          <ProfileSection
            title="Experience"
            onAdd={() => {
              setPopupType("workExperience");
              setPopupData({
                jobtitle: "",
                company: "",
                location: "",
                industry: "",
                startDate: "",
                endDate: "",
                isCurrentJob: false,
                description: "",
                index: null,
              });
              togglePopup();
            }}
            contentExists={workExperience.length > 0}
          >
            <ExperienceSection
              workExperience={workExperience}
              setWorkExperience={setWorkExperience}
            />
          </ProfileSection>

          <ProfileSection
            title="Education"
            onAdd={toggleEducationForm}
            contentExists={educations.length > 0}
          >
            <EducationSection
              educations={educations}
              setEducations={setEducations}
            />
          </ProfileSection>

          <ProfileSection
            title="Skills"
            contentExists={skills.length > 0}
            onAdd={() => {
              setPopupType("Skills");
              setPopupData({ skill: "" });
              togglePopup();
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
              setPopupType("certifications");
              setPopupData({
                title: "",
                issuingOrganization: "",
                issueDate: "",
                expirationDate: "",
                credentialId: "",
                credentialURL: "",
                index: null,
              });
              togglePopup();
            }}
            contentExists={certifications.length > 0}
          >
            <Certifications
              certifications={certifications}
              setCertifications={setCertifications}
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
            }}
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

        {showEducationForm && (
          <MultiStepEducationForm
            toggleForm={toggleEducationForm}
            updateParentState={updateParentState}
            type="Education"
            data={popupData}
            setData={setPopupData}
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
  } else if (userType === "employer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 p-8 rounded-2xl shadow-gray-500 shadow-2xl max-w-lg mx-auto mt-28"
      >
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Employer Profile
        </h2>
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-40 h-40 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-6xl mr-4 mb-4"
          >
            {user.name.charAt(0).toUpperCase()}
          </motion.div>
          <h3 className="text-2xl font-semibold text-gray-700">
            {user.name || "Loading..."}
          </h3>
          <p className="text-gray-500 mt-2">Employer</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg gap-3">
            <FiMail className="w-4 h-6 text-orange-500" />
            <div>
              {/* <p className="text-sm text-gray-500">Email</p> */}
              <p className="sm:text-l text-lg font-medium text-gray-700">
                {user.email || "Loading..."}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center font-medium hover:bg-red-600 transition duration-300"
          >
            <FiLogOut className="mr-2" /> Logout
          </motion.button>
        </div>
      </motion.div>
    );
  }
};
export default Profile;
