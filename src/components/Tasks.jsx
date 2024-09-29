import React, { useState } from 'react'
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dateFnsFormat from 'date-fns/format'
import { isAfter, isBefore, addDays, isToday } from 'date-fns';

const FORMAT = "dd/MM/yyyy";
function formatDate(date, format, locale){
    return dateFnsFormat(date, format, {locale});
}

const AddTask = ({onCancel, onAddTask}) => {
    const [task, setTask] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [inputValue, setInputValue] = useState(new Date().toLocaleDateString());
    const [showCalendar, setShowCalendar] = useState(false);

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setInputValue(day.toLocaleDateString());
        setShowCalendar(false); // Close the calendar on selection
    };
    return (
        <div className='add-task-dialog'>
            <input value={task} onChange={(event) => setTask(event.target.value)}/>
            <div className='add-task-actions-container'>
                <div className='btns-container'>
                    <button disabled={!task} className='add-btn' onClick={() => {onAddTask(task, selectedDate); onCancel(); setTask("");}}>Add Task</button>
                    <button className='cancel-btn' onClick={() => {onCancel(); setTask("");}}>Cancel</button>
                </div>
                <div className='icon-container'>
                    <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setShowCalendar((prev) => !prev)}
                    placeholder="Select a date"
                    />
                    {showCalendar && (
                        <div>
                        <DayPicker onDayClick={handleDayClick} disabled={{ before: new Date() }}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const TASK_HEADER_MAPPING = {
    INBOX : "Inbox",
    TODAY : "Today",
    NEXT_7 : "Next 7 Days"
}

const TaksItems = ({selectedTab, tasks}) => {
    let tasksToRender = [...tasks];
    if(selectedTab === 'NEXT_7'){
        tasksToRender = tasksToRender.filter((task) => isAfter(task.date, new Date()) && isBefore(task.date, addDays(new Date(), 7)))
    }
    if(selectedTab === 'TODAY'){
        tasksToRender = tasksToRender.filter((task) => isToday(task.date))
    }
    return (
        <div className='task-items-container'>
            {tasksToRender.map((task) => (
                <div className='task-item'>
                    <p>{task.text}</p>
                    <p>{dateFnsFormat(new Date(task.date), FORMAT)}</p>
                </div>
            ))}
        </div>
    )
}

const Tasks = ({selectedTab}) => {
    const [showAddTask, setShowAddTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    const addNewTask = (text, selectedDate) => {
        const newTaskItem = {text, date: selectedDate || new Date()}
        setTasks((prevState) => [...prevState, newTaskItem]);
    }
    return (
    <div className='tasks'>
        <h1>{TASK_HEADER_MAPPING[selectedTab]}</h1>
        {selectedTab === "INBOX" ? <div className='add-task-btn' onClick={() => setShowAddTask((prevState) => !prevState)}>
            <span className='plus'>+</span>
            <span className='add-task-text'>Add Task</span>
        </div> : null}
        {showAddTask && <AddTask onAddTask = {addNewTask} onCancel = {() => setShowAddTask(false)}/>}
        {tasks.length > 0 ? (<TaksItems selectedTab={selectedTab} tasks = {tasks}/> ): (<p>No Task Yet!</p>)}
    </div>
    )
}

export default Tasks
