import { useParams } from "react-router-dom";
import VacancyCard from "./DashboardLayout/VacancyCard";
import CompanyCard from "./NavMenu/CompanyCard";
import api from '../api/axiosapi';
import { useEffect, useState } from "react";
import {useNotification} from '../contexts/NotificationContext';

export default function VacancyDetails() {
    const { vacancyId } = useParams()
    const [vacancy, setVacancy] = useState({});
    const [companyId, setCompanyId] = useState();
    const [company, setCompany] = useState({});
    const notify = useNotification("");

    useEffect(() => {
        async function getVacancy() {
            if (!vacancyId) {
                notify("error", "Something went wrong");
                return;
            }

            const resp = await api.get('/vacancy', {
                params: { job_role_id: vacancyId }
            });

            if (resp.status === 200) {
                setVacancy(resp.data);
                setCompanyId(resp.data.company_id);
            } else {
                notify("Error", "No Vacancy found");
            }
        }

        getVacancy();
    }, [vacancyId]);

    useEffect(() => {
        async function getVacancyCompany() {
            if (!companyId) return;

            const resp = await api.get('/company', {
                params: { company_id: companyId }
            });

            if (resp.status === 200) {
                setCompany(resp.data);
            } else {
                notify("Error", "No Company found");
            }
        }

        getVacancyCompany();
    }, [companyId]);

    return(
        <>
            <VacancyCard vacancy={vacancy} expand={true} />
            <CompanyCard company={company} />
        </>
    )
}