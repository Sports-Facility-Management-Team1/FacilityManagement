
async function getMonthlyIssueData(){

    try{
        const res = await fetch('https://sports-management.azurewebsites.net/api/issues/all');
        const { issues } = await res.json();
        
        const currentYear = new Date().getFullYear();
        const solvedIssues = Array(12).fill(0);
        const unsolvedIssues = Array(12).fill(0);

        issues.forEach(issue => {
            const createdAt = new Date(issue.createdAt);
            const status = (issue.status || '').toLowerCase();

            if (createdAt.getFullYear() !== currentYear) return;

            const month = createdAt.getMonth(); 

            if (status === 'solved') {
                solvedIssues[month]++;
            }
            else {
                unsolvedIssues[month]++;
            }
        });

        return { solvedIssues, unsolvedIssues };

    }
    catch (error) {
        console.error('Failed to fetch or procces issues:', error);
        return { solvedIssues: [], unsolvedIssues: [] };
    }

}

export { getMonthlyIssueData }