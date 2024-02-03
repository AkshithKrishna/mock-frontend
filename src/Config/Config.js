//AWS END Point APIs

const config={
    apiBaseUrl: "https://29q4ntneii.execute-api.us-east-2.amazonaws.com/vesrion1",
    recordMockCall: "/student/v1/insertmockcall",
    getMyMockCalls: "/student/v1/mycalllist",
    addTempQuestionsByUser:"/student/v1/inserttempquestions",
    getMainQuestionsCall:"/student/v1/questions",
    fetchTempQuestions:"/student/v1/tempquestions",
    addNewQuestionfromTemp:"/student/v1/insertquestions",
    deleteTempQuestion:"/student/v1/deletetempquestions"
}

export default config;