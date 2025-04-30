import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Chart() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    date_start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_end: format(new Date(), "yyyy-MM-dd"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const fetchChartData = async (type) => {
    if (type === "reset") {
      setForm({
        date_start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        date_end: format(new Date(), "yyyy-MM-dd"),
      });
    }

    let conditions = [];

    // Tanggal
    if (form.date_test) {
      conditions.push(
        where("date_test", ">=", format(form.date_start, "yyyy/MM/dd"))
      );
      conditions.push(
        where("date_test", "<=", format(form.date_end, "yyyy/MM/dd"))
      );
    }

    const collectionRef = collection(db, "reaction_test");
    const queryData = query(collectionRef, ...conditions);
    const snapshot = await getDocs(queryData);

    const raw = snapshot.docs.map((doc) => doc.data());

    // Buat struktur data per hari
    const days = eachDayOfInterval({
      start: new Date(form.date_start),
      end: new Date(form.date_end),
    });

    const dailyStats = days.map((day) => {
      const formattedDay = format(day, "yyyy/MM/dd");
      const entries = raw.filter((entry) => entry.date_test === formattedDay);

      const totalTime = entries.reduce(
        (sum, entry) => sum + entry.reaction_time,
        0
      );

      return {
        date: format(day, "MM/dd"),
        reaction_time: totalTime / entries.length,
      };
    });

    setData(dailyStats);
  };

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ paddingBottom: "80px" }}>
      <div className="p-4 text-white bg-sky-600">
        <center>
          <h1>Reaction Time Chart</h1>
        </center>
        <Row className="gy-3 gx-4 mb-4 justify-content-center">
          <Col xs={12} md="auto">
            <Form.Group controlId="date_start">
              <Form.Label>Date Start</Form.Label>
              <Form.Control
                type="date"
                name="date_start"
                value={form.date_start}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md="auto">
            <Form.Group controlId="date_end">
              <Form.Label>Date End</Form.Label>
              <Form.Control
                type="date"
                name="date_end"
                value={form.date_end}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md="auto" className="d-flex align-items-end gap-2">
            <Button
              style={{
                backgroundColor: "#FFD154",
                borderColor: "#FFD154",
                color: "black",
              }}
              size="md"
              className="w-50"
              onClick={() => fetchChartData()}
            >
              Filter
            </Button>
            <Button
              style={{
                backgroundColor: "#dc3545",
                borderColor: "#dc3545",
              }}
              size="md"
              className="w-50"
              onClick={() => fetchChartData("reset")}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </div>

      <Card className="p-4 m-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `${value} ms`} />
            <Tooltip formatter={(value) => [`${value} ms`, "Avg Reaction Time"]} />
            <Bar dataKey="reaction_time" fill="#8884d8" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
