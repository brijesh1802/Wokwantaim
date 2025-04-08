const Admin = require('../models/admin.model.js');
const Company = require('../models/jobSettings/company.model.js');
const Industry = require('../models/jobSettings/industry.model.js');
const JobType = require('../models/jobSettings/jobType.model.js');
const experienceLevel = require('../models/jobSettings/experience.model.js');
const Candidate = require('../models/candidate.model.js');
const { uploadToCloudinary,deleteFromCloudinary } = require('../middleware/upload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const signup = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 3, max: 20 })) {
        return res.status(400).json({ message: 'Username must be alphanumeric and between 3-20 characters' });
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0
    })) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number' });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUsername = await Admin.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            email,
            role
        });
        await newAdmin.save();

        return res.status(201).json({ message: 'Admin created successfully' });

    } catch (error) {
        console.error('Error in admin signup:', error);
        return res.status(500).json({ message: 'An error occurred during signup' });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d', algorithm: 'HS256' }
        );

        res.json({ message: "Login successful!", token });

    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

const profile = async (req, res) => {
    try {
        const userEmail = req.user.email;

        const admin = await Admin.findOne({ email: userEmail });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Profile fetched successfully', admin });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

const getAll = async (req, res) => {
    try {
        const admins = await Admin.find({}, '-password');
        res.json(admins);
    } catch (error) {
        console.error('Error in getting all admins:', error);
        res.status(500).json({ message: 'An error occurred while getting all admins' });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await admin.deleteOne();
        res.json({ message: 'Admin deleted successfully' });

    } catch (error) {
        console.error('Error in deleting admin:', error);
        res.status(500).json({ message: 'An error occurred while deleting admin' });
    }
}

const editAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const { username, email, role } = req.body;

        if (username) admin.username = username;
        if (email) admin.email = email;
        if (role) admin.role = role;

        await admin.save();
        res.json({ message: 'Details edited successfully' });

    } catch (error) {
        console.error('Error in editing admin:', error);
        res.status(500).json({ message: 'An error occurred while editing admin' });
    }
}

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error in getting admin:', error);
        res.status(500).json({ message: 'An error occurred while getting admin' });
    }
}


const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOneAndDelete({ _id: req.params.id });
        
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.json({ message: 'Candidate deleted successfully' });

    } catch (error) {
        console.error('Error in deleting candidate:', error);
        res.status(500).json({ message: 'An error occurred while deleting candidate' });
    }
};


const getPublicIdFromUrl = (url) => {
    const regex = /upload\/v\d+\/([^\.]+)/;  // Matches the part after "upload/v123456789/" and before the file extension
    const matches = url.match(regex);
    if (matches) {
        return matches[1];  
    }
    throw new Error('Invalid Cloudinary URL');
};


const addCompany = async (req, res) => {
    try {
        const name  = req.body.name;

        if (!name) {
            return res.status(400).json({ message: 'Name and logo are required' });
        }

        const logoFile = req.files['logo'][0].buffer;

        if (!logoFile) {
            return res.status(400).json({ message: 'Logo is required' });
        }

        const logoUpload = await uploadToCloudinary(logoFile, 'uploads/companyLogo','image');

        const newCompany = new Company({ name, logo: logoUpload.url });
        await newCompany.save();
        res.status(201).json({ message: 'Company added successfully' });

    } catch (error) {
        console.error('Error in adding company:', error);
        res.status(500).json({ message: 'An error occurred while adding company' });
    }
}

const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findOneAndDelete({ _id: req.params.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        if (company.logo) {
                    const logoPublicId = getPublicIdFromUrl(company.logo);
                    await deleteFromCloudinary(logoPublicId);
        }
        await company.deleteOne();
        res.status(201).json({ message: 'Company deleted successfully' });

    } catch (error) {
        console.error('Error in deleting company:', error);
        res.status(500).json({ message: 'An error occurred while deleting company' });
    }
}

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        console.error('Error in getting all companies:', error);
        res.status(500).json({ message: 'An error occurred while getting all companies' });
    }
}

// Add Industry
const addIndustry = async (req, res) => {
    try {
        const name = req.body.name;
console.log("Name",name);

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const existingIndustry = await Industry.findOne({ name });
        if (existingIndustry) {
            return res.status(400).json({ message: 'Industry with this name already exists' });
        }

        const newIndustry = new Industry({ name });
        await newIndustry.save();
        res.status(201).json({ message: 'Industry added successfully' });

    } catch (error) {
        console.error('Error in adding industry:', error);
        res.status(500).json({ message: 'An error occurred while adding industry', error: error.message });
    }
}

// Delete Industry
const deleteIndustry = async (req, res) => {
    try {
        const industry = await Industry.findById(req.params.id);
        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }
        await industry.deleteOne();
        res.status(200).json({ message: 'Industry deleted successfully' });

    } catch (error) {
        console.error('Error in deleting industry:', error);
        res.status(500).json({ message: 'An error occurred while deleting industry', error: error.message });
    }
}

// Get all Industries
const getIndustries = async (req, res) => {
    try {
        const industries = await Industry.find();
        res.json(industries);
    } catch (error) {
        console.error('Error in getting all industries:', error);
        res.status(500).json({ message: 'An error occurred while getting all industries', error: error.message });
    }
}

// Add Job Type
const addJobType = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const existingJobType = await JobType.findOne({ name });
        if (existingJobType) {
            return res.status(400).json({ message: 'Job Type with this name already exists' });
        }

        const newJobType = new JobType({ name });
        await newJobType.save();
        res.status(201).json({ message: 'Job Type added successfully' });

    } catch (error) {
        console.error('Error in adding job type:', error);
        res.status(500).json({ message: 'An error occurred while adding job type', error: error.message });
    }
}

// Delete Job Type
const deleteJobType = async (req, res) => {
    try {
        const jobType = await JobType.findById(req.params.id);
        if (!jobType) {
            return res.status(404).json({ message: 'Job Type not found' });
        }
        await jobType.deleteOne();
        res.status(200).json({ message: 'Job Type deleted successfully' });

    } catch (error) {
        console.error('Error in deleting job type:', error);
        res.status(500).json({ message: 'An error occurred while deleting job type', error: error.message });
    }
}

// Get all Job Types
const getJobTypes = async (req, res) => {
    try {
        const jobTypes = await JobType.find();
        res.json(jobTypes);
    } catch (error) {
        console.error('Error in getting all job types:', error);
        res.status(500).json({ message: 'An error occurred while getting all job types', error: error.message });
    }
}

// Add Experience Level
const addExperienceLevel = async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const existingExperienceLevel = await experienceLevel.findOne({ name });
        if (existingExperienceLevel) {
            return res.status(400).json({ message: 'Experience Level with this name already exists' });
        }

        const newExperienceLevel = new experienceLevel({ name });
        await newExperienceLevel.save();
        res.status(201).json({ message: 'Experience Level added successfully' });

    } catch (error) {
        console.error('Error in adding experience level:', error);
        res.status(500).json({ message: 'An error occurred while adding experience level', error: error.message });
    }
}

// Delete Experience Level
const deleteExperienceLevel = async (req, res) => {
    try {
        
        const ExperienceLevel = await experienceLevel.findById(req.params.id);
        if (!ExperienceLevel) {
            return res.status(404).json({ message: 'Experience Level not found' });
        }
        await ExperienceLevel.deleteOne();
        res.status(200).json({ message: 'Experience Level deleted successfully' });

    } catch (error) {
        console.error('Error in deleting experience level:', error);
        res.status(500).json({ message: 'An error occurred while deleting experience level', error: error.message });
    }
}

// Get all Experience Levels
const getExperienceLevels = async (req, res) => {
    try {
        const experienceLevels = await experienceLevel.find();
        res.json(experienceLevels);
    } catch (error) {
        console.error('Error in getting all experience levels:', error);
        res.status(500).json({ message: 'An error occurred while getting all experience levels', error: error.message });
    }
}



module.exports = { signup, login, profile, getAll, deleteAdmin, editAdmin, getAdmin, deleteCandidate, addCompany, deleteCompany, getCompanies, addIndustry, deleteIndustry, getIndustries, addJobType, deleteJobType, getJobTypes, addExperienceLevel, deleteExperienceLevel, getExperienceLevels };
