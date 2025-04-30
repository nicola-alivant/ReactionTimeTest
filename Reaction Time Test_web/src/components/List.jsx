import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { Button, Table, Col, Row, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function List() {
  const [lists, setLists] = useState([]);
  const [formInsert, setFormInsert] = useState({ reaction_time: 0 });
  const [formFilter, setFormFilter] = useState({ date_test: "" });
  const [showInsert, setShowInsert] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const collectionRef = collection(db, "reaction_test");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type == "number") {
      setFormInsert({ ...formInsert, [name]: value });
    } else {
      setFormFilter({ ...formFilter, [name]: value });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const getLists = async (date_test) => {
    let queryData;
    if (date_test) {
      const test = new Date(date_test);
      queryData = query(
        collectionRef,
        where("date_test", "==", formatDate(test)),
        orderBy("date_test", "desc")
      );
    } else {
      queryData = query(collectionRef, orderBy("date_test", "desc"));
      formFilter.date_test = "";
    }
    const data = await getDocs(queryData);
    setLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteList = async (id) => {
    try {
      const docRef = doc(db, "reaction_test", id);
      await deleteDoc(docRef);
      toast.success("Data deleted!");
      getLists();
      handleClose();
    } catch (error) {
      toast.error("Failed to delete data");
      console.error(error);
    }
  };

  const handleClose = () => {
    setShowDelete(false);
    setShowInsert(false);
    setSelectedItem(null);
  };

  const handleShow = (item) => {
    if (item) {
      setSelectedItem(item);
      setShowDelete(true);
    } else {
      setShowInsert(true);
    }
  };

  const insertData = async () => {
    const currentDate = new Date();
    const getCurrentDate = formatDate(currentDate);

    await addDoc(collectionRef, {
      date_test: getCurrentDate,
      reaction_time: formInsert.reaction_time,
    });
    toast.success("Data inserted!");
    handleClose();
    getLists();
    formInsert.reaction_time = 0;
  };

  return (
    <>
      <div className="p-4 text-white bg-sky-600">
        <center>
          <h1>Reaction Time Tester</h1>
          <h6>
            Based on this{" "}
            <a
              href="https://humanbenchmark.com/tests/reactiontime"
              style={{ textDecoration: "none", color: "#FFD154" }}
              target="_blank"
            >
              website
            </a>
          </h6>
          <Button
            className="my-2"
            style={{
              backgroundColor: "#FFD154",
              borderColor: "#FFD154",
              color: "black",
            }}
            onClick={() => handleShow()}
          >
            Add Data
          </Button>
        </center>
        <Row className="gy-3 gx-4 mb-4 justify-content-center">
          <Col xs={12} md="auto">
            <Form.Group controlId="date_test">
              <Form.Label>Date Test</Form.Label>
              <Form.Control
                type="date"
                name="date_test"
                value={formFilter.date_test}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md="auto" className="d-flex align-items-end gap-2">
            <Button
              size="md"
              className="w-50"
              onClick={() => getLists(formFilter.date_test)}
              style={{
                backgroundColor: "#FFD154",
                borderColor: "#FFD154",
                color: "black",
              }}
            >
              Filter
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-50"
              onClick={() => getLists()}
              style={{
                backgroundColor: "#dc3545",
                borderColor: "#dc3545",
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </div>

      <div className="m-4">
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Reaction Time</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list, i) => (
              <tr key={list.id}>
                <td>{i + 1}</td>
                <td>{list.date_test}</td>
                <td>{list.reaction_time} ms</td>
                <td>
                  <Button
                    onClick={() => handleShow(list)}
                    style={{
                      backgroundColor: "#dc3545",
                      borderColor: "#dc3545",
                    }}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showInsert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label for="reaction_time">
            <h2>Reaction Time (ms)</h2>
          </label>
          <input
            className="form-control"
            type="number"
            min={0}
            name="reaction_time"
            id="reaction_time"
            value={formInsert.reaction_time}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => insertData()}>
            Insert
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to delete this data?
          <br />
          <strong>{selectedItem?.reaction_time}</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={() => deleteList(selectedItem?.id)}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
