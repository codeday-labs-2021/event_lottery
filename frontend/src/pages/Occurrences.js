import React, { useState, useEffect } from "react";
import { Form, Col, Button, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
const baseURL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_API;

export const Occurrence = () => {

    return (
        <Container>
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <Form   >
                        <Form.Row>
                            <Form.Group as={Col} xs="12" controlId="formGridEventName">

                                <Form.Label>Event Name</Form.Label>
                                <Form.Control
                                    required
                                    name="eventName"
                                //onChange=
                                //value=
                                />

                            </Form.Group>
                            <Col md={{ span: 12, offset: 4 }}>
                                <Form.Group as={Col} xs="4" controlId="formGridMaxAttendees">
                                    <Form.Label>Max Attendees</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        min="0"
                                        name="maxAttendees"
                                    // onChange= 
                                    // value= 
                                    />

                                </Form.Group>
                            </Col>
                        </Form.Row>

                        <Form.Row >
                            <Form.Group as={Col} controlId="formGridStartDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="startDate"
                                // onChange= 
                                // value= 
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridStartTime">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    required
                                    type="time"
                                    name="startTime"
                                // onChange= 
                                // value= 
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="endDate"
                                // onChange= 
                                // value= 
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEndTime">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    required
                                    type="time"
                                    name="endTime"
                                //  onChange= 
                                //  value= 
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridLotteryDate">
                                <Form.Label>Lottery Date</Form.Label>
                                <Form.Control
                                    required
                                    type="date"
                                    name="lotteryDate"
                                //  onChange={changeHandler}
                                //  value={formData.lotteryDate}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridLotteryTime">
                                <Form.Label>Lottery Time</Form.Label>
                                <Form.Control
                                    required
                                    type="time"
                                    name="lotteryTime"
                                //  onChange={changeHandler}
                                //  value={formData.lotteryTime}
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridBreed">
                                <Form.Label>Occurrences</Form.Label>
                                <Form.Control
                                    as="select"
                                // value= 
                                // onChange= 
                                >
                                    <option>Do not Rept</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>

                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>


    );
}