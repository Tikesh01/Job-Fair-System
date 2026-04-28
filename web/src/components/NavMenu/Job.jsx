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
        <>
            <h1>See vacancies here</h1>
        </>
    );
}