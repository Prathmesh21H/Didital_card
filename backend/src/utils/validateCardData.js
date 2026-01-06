export const validateCardData = (data) => {
    const errors = {};
  
    // Full Name: Required, at least 2 characters
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }
  
    // Email: Required, must match email regex
    if (!data.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
    ) {
      errors.email = "Invalid email format";
    }
  
    // Phone: Optional, international format allowed
    if (data.phone && !/^\+?\d{10,15}$/.test(data.phone)) {
      errors.phone = "Phone must be 10–15 digits and may include + for country code";
    }
  
    // Website: Optional, must be valid URL if present
    if (data.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(data.website)) {
      errors.website = "Invalid URL";
    }
  
    // Job Title: Optional, max 50 characters
    if (data.jobTitle && data.jobTitle.length > 50) {
      errors.jobTitle = "Job title cannot exceed 50 characters";
    }
  
    // Company: Optional, max 50 characters
    if (data.company && data.company.length > 50) {
      errors.company = "Company name cannot exceed 50 characters";
    }
  
    // Bio: Optional, 10–100 characters
    if (data.bio && (data.bio.trim().length < 10 || data.bio.trim().length > 100)) {
      errors.bio = "Bio must be between 10 and 100 characters";
    }
  
    // Social links: Optional, must be valid URL
    const socialFields = ["linkedin", "twitter", "facebook", "instagram"];
    socialFields.forEach((field) => {
      if (data[field] && !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(data[field])) {
        errors[field] = `Invalid ${field} URL`;
      }
    });
  
    return Object.keys(errors).length ? errors : null;
  };
  