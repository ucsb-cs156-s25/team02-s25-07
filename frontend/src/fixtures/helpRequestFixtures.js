const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "acdamstedt@ucsb.edu",
    teamID: "07",
    tableOrBreakoutRoom: "07",
    localDateTime: "2022-01-02T12:00:00",
    explanation: "Setting up fixtures not working",
    solved: "true",
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "acdamstedt@ucsb.edu",
      teamID: "07",
      tableOrBreakoutRoom: "07",
      localDateTime: "2022-01-02T12:00:00",
      explanation: "Setting up fixtures not working",
      solved: "true",
    },
    {
      id: 2,
      requesterEmail: "acdamstedt@umail.ucsb.edu",
      teamID: "01",
      tableOrBreakoutRoom: "01",
      localDateTime: "2022-02-02T12:00:00",
      explanation: "Setting up fixtures really not working",
      solved: "true",
    },
    {
      id: 3,
      requesterEmail: "acdamstedt@csil.cs.ucsb.edu",
      teamID: "03",
      tableOrBreakoutRoom: "03",
      localDateTime: "2022-03-02T12:00:00",
      explanation: "Setting up fixtures completely broken",
      solved: "true",
    },
  ],
};

export { helpRequestFixtures };
