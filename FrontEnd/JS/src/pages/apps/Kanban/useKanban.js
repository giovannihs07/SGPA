import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { tasks as defaultTasks, sections as defaultSections } from "./helper";
const useKanban = () => {
  const [tasks, setTasks] = useState(defaultTasks);
  const [sections, setSections] = useState(defaultSections);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState(null);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const getTasks = useCallback(id => {
    return tasks.filter(task => task.section == id);
  }, [tasks]);
  function toggleNewTaskModal() {
    setNewTaskModal(prevState => !prevState);
  }
  const toggleDescriptionModal = () => {
    setDescriptionModal(prevState => !prevState);
  };
  const newTask = section => {
    setNewTaskDetails({
      dueDate: new Date(),
      section: section
    });
    setNewTaskModal(true);
  };
  const onAddSection = () => {
    const section = {
      id: sections.length.toString(),
      title: "New Section"
    };
    setSections([...sections, section]);
    setSelectedSection(section);
  };
  const onChangeSectionTitle = e => {
    if (selectedSection) {
      const nSection = {
        ...selectedSection,
        title: e.target.value
      };
      setSelectedSection(nSection);
      setSections(sections.map(section => {
        return section.id == selectedSection.id ? nSection : section;
      }));
    }
  };
  const handleDateChange = date => {
    if (newTaskDetails) {
      setNewTaskDetails({
        ...newTaskDetails,
        dueDate: date
      });
    }
  };
  const onDragEnd = result => {
    const {
      source,
      destination
    } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    let sourceOccurrence = source.index;
    let destinationOccurrence = destination.index;
    let sourceId = 0,
      destinationId = 0;
    tasks.forEach((task, index) => {
      if (task.section == source.droppableId) {
        if (sourceOccurrence == 0) {
          sourceId = index;
        }
        sourceOccurrence--;
      }
      if (task.section == destination.droppableId) {
        if (destinationOccurrence == 0) {
          destinationId = index;
        }
        destinationOccurrence--;
      }
    });
    const task = tasks[sourceId];
    const newTasks = tasks.filter(t => t.id != task.id);
    task.section = destination.droppableId;
    const parity = destination.droppableId != source.droppableId ? -1 : 0;
    setTasks([...newTasks.slice(0, destinationId + parity), task, ...newTasks.slice(destinationId + parity)]);
  };

  //Form Submission
  const taskSchema = yup.object({
    category: yup.string().required("Select Project Category"),
    title: yup.string().required("Please enter Project Title"),
    priority: yup.mixed().required("Please enter Project Priority"),
    description: yup.string().required("Please enter Project Description"),
    assignTo: yup.string().required("Please select whom to assign")
  });
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      priority: "high"
    }
  });
  const handleNewTask = handleSubmit(values => {
    const formData = {
      category: values.category,
      title: values.title,
      priority: values.priority,
      description: values.description,
      userAvatar: [JSON.parse(values.assignTo)]
    };
    const newTask = {
      ...newTaskDetails,
      ...formData,
      id: tasks.length,
      comments: 35,
      dueDate: newTaskDetails.dueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    };
    setTasks([...tasks, newTask]);
    toggleNewTaskModal();
    reset();
  });
  return {
    onDragEnd,
    newTask,
    sections,
    getTasks,
    newTaskModal,
    toggleNewTaskModal,
    handleNewTask,
    selectedSection,
    setSelectedSection,
    control,
    handleSubmit,
    newTaskDetails,
    handleDateChange,
    descriptionModal,
    toggleDescriptionModal,
    onAddSection,
    onChangeSectionTitle
  };
};
export default useKanban;