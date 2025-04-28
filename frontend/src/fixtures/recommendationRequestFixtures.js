const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "yuchenliu735@ucsb.edu",
        "professorEmail": "phtcon@ucsb.edu",
        "explanation": "Recommendation letter from Prof. Conrad for Steven Liu",
        "dateRequested": "2025-04-28T11:17:36",
        "dateNeeded": "2025-05-28T23:59:59",
        "done": true
    },
    threeRecommendationRequests: [
        {
            "id": 1,
            "requesterEmail": "yuchenliu735@ucsb.edu",
            "professorEmail": "phtcon@ucsb.edu",
            "explanation": "Recommendation letter from Prof. Conrad for Steven Liu",
            "dateRequested": "2025-04-28T11:17:36",
            "dateNeeded": "2025-05-28T23:59:59",
            "done": true
        },
        {
            "id": 2,
            "requesterEmail": "yuchenliu735@ucsb.edu",
            "professorEmail": "ramtin@ece.ucsb.edu",
            "explanation": "Recommendation letter from Prof. Pedarsani for Steven Liu",
            "dateRequested": "2025-04-28T12:00:36",
            "dateNeeded": "2025-05-10T23:59:59",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "lzhou@ucsb.edu",
            "professorEmail": "hualee@ucsb.edu",
            "explanation": "Recommendation letter from Prof. Lee for Forrest Zhou",
            "dateRequested": "2025-03-28T15:25:51",
            "dateNeeded": "2025-03-30T23:59:59",
            "done": true
        }
    ]
};

export { recommendationRequestFixtures };