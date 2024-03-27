import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import './Todo.css';

const Todo1 = () => {
    const [state, setState] = useState([]);
    const [editId, setEditId] = useState(null);
    const dataRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("http://localhost:4001/data")
            .then(res => res.json())
            .then(data => setState(data))
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:4001/data/${id}`, {
            method: 'DELETE'
        }).then(fetchData)
            .catch(error => console.error('Error deleting data:', error));
    };

    const handleEdit = (id) => {
        setEditId(id);
    };

    const handleUpdate = (id, newValue) => {
        fetch(`http://localhost:4001/data/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: newValue })
        }).then(fetchData)
            .catch(error => console.error('Error updating data:', error));

        setEditId(null); // Exit edit mode
    };

    const handleChange = (id, newValue) => {
        setState(prevState =>
            prevState.map(item =>
                item.id === id ? { ...item, state: newValue } : item
            )
        );
    };

    const handleAdd = () => {
        const newData = dataRef.current.value;
        if (newData) {
            fetch("http://localhost:4001/data", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: newData })
            }).then(fetchData)
                .catch(error => console.error('Error adding data:', error));
        }
    };

    return (
        <div className='t'>
            <div className='tsk'>
                <h1>Todo List</h1>
                <div className="tsk1">
                    <input type="text" ref={dataRef} placeholder='Enter Task' />
                    <button onClick={handleAdd}>Add</button>
                </div>
                <div className="tsk2">
                    <div>
                        <table cellSpacing={"17px"} >
                            {state.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr>
                                        {editId === item.id ? (
                                            <>
                                                <td>{item.id}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={item.state}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdate(
                                                                item.id,
                                                                item.state
                                                            )
                                                        }
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className='state'>{item.state}</td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }> Delete
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="line"></div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo1;
