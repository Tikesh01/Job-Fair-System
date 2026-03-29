import { FaSearch, FaFilter, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';
import './Job.css';
import { useState } from 'react';

export default function Job() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Mock job data
    const jobs = [
        {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'Tech Solutions Inc',
            location: 'New York, NY',
            salary: '$120k - $150k',
            category: 'frontend',
            type: 'Full-time'
        },
        {
            id: 2,
            title: 'Backend Engineer',
            company: 'Cloud Innovations',
            location: 'San Francisco, CA',
            salary: '$130k - $160k',
            category: 'backend',
            type: 'Full-time'
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            company: 'Creative Studios',
            location: 'Los Angeles, CA',
            salary: '$80k - $110k',
            category: 'design',
            type: 'Full-time'
        },
        {
            id: 4,
            title: 'Data Scientist',
            company: 'AI Solutions',
            location: 'Boston, MA',
            salary: '$110k - $140k',
            category: 'data',
            type: 'Full-time'
        }
    ];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase())
            || job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="job-container">
            <div className="job-header">
                <h1>Job Opportunities</h1>
                <p>Find your perfect role from thousands of opportunities</p>
            </div>

            <div className="job-controls">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <FaFilter />
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="all">All Categories</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="design">Design</option>
                        <option value="data">Data Science</option>
                    </select>
                </div>
            </div>

            <div className="jobs-grid">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <div key={job.id} className="job-card">
                            <div className="job-card-header">
                                <h3>{job.title}</h3>
                                <span className="job-type">{job.type}</span>
                            </div>
                            <p className="company-name">{job.company}</p>
                            <div className="job-details">
                                <div className="detail">
                                    <FaMapMarkerAlt />
                                    <span>{job.location}</span>
                                </div>
                                <div className="detail">
                                    <FaMoneyBillWave />
                                    <span>{job.salary}</span>
                                </div>
                            </div>
                            <button className="apply-btn">Apply Now</button>
                        </div>
                    ))
                ) : (
                    <div className="no-jobs">
                        <p>No jobs found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}