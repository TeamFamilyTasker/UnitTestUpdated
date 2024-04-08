const { getEvents, createEvent, updateEvent, deleteEvent, getAllEvents } = require("../controllers/events");
const Event = require("../models/Event");
const User = require("../models/user");
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');

jest.mock("../models/Event");
jest.mock("../models/user");

describe("Event Controller tests", () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = null;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

     describe("getEvents", () => {
        it("should return 404 if user not found", async () => {
            const userId = new mongoose.Types.ObjectId();
            req.user = { id: userId };
            User.findById.mockResolvedValue(null);

            await getEvents(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual({ ok: false, msg: "User not found." });
        });

        it("should return 400 if user has no family", async () => {
            const userId = new mongoose.Types.ObjectId();
            req.user = { id: userId };
            User.findById.mockResolvedValue({});

            await getEvents(req, res);

            expect(res.statusCode).toBe(400);
            expect(res._getJSONData()).toEqual({ ok: false, msg: "User does not belong to a family." });
        });


        it("should handle exceptions", async () => {
            const userId = new mongoose.Types.ObjectId();
            req.user = { id: userId };
            User.findById.mockRejectedValue(new Error('User lookup failed'));

            await getEvents(req, res);

            console.log("Response body:", res._getJSONData());
            console.log("Response status code:", res.statusCode);

            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({ ok: false, msg: "Please, contact the administrator" });
        });
    });

    // Further tests should follow a similar structure.
    // Due to the complexity and variety of each function, specific mocks and assertions will vary.
    // For brevity, this example focuses on getEvents.
});
