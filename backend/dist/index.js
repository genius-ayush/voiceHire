"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const job_postings_1 = __importDefault(require("./routes/job-postings"));
const candidates_1 = __importDefault(require("./routes/candidates"));
const questions_1 = __importDefault(require("./routes/questions"));
const recruiters_1 = __importDefault(require("./routes/recruiters"));
const interviews_1 = __importDefault(require("./routes/interviews"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/auth', auth_1.default);
app.use('/jobPostings', job_postings_1.default);
app.use('/candidates', candidates_1.default);
app.use('/questions', questions_1.default);
app.use('/recruiters', recruiters_1.default);
app.use('/interviews', interviews_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
