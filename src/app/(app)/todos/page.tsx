'use client';

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle } from 'lucide-react'

interface Task {
  id: string
  text: string
  completed: boolean
}

interface TodoList {
  title: string
  tasks: Task[]
}

const initialLists: TodoList[] = [
  {
    title: 'Homework',
    tasks: [
      { id: 'h1', text: 'Math worksheet pages 5-7', completed: false },
      { id: 'h2', text: 'Read "The Giver" Chapter 4', completed: true },
      { id: 'h3', text: 'Study for Science vocabulary quiz', completed: false }
    ]
  },
  {
    title: 'Chores',
    tasks: [
      { id: 'c1', text: 'Clean my room', completed: false },
      { id: 'c2', text: 'Take out the trash', completed: false },
      { id: 'c3', text: 'Feed the dog', completed: true }
    ]
  },
  {
    title: 'Fun Stuff',
    tasks: [
      { id: 'f1', text: 'Finish drawing my comic book', completed: false },
      { id: 'f2', text: 'Practice my new skateboard trick', completed: false }
    ]
  }
]

const TaskItem = ({
  task,
  onToggle
}: {
  task: Task
  onToggle: (id: string) => void
}) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
    <Checkbox
      id={task.id}
      checked={task.completed}
      onCheckedChange={() => onToggle(task.id)}
    />
    <label
      htmlFor={task.id}
      className={`text-sm font-medium leading-none ${
        task.completed ? 'line-through text-muted-foreground' : ''
      } peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
    >
      {task.text}
    </label>
  </div>
)

export default function TodosPage() {
  const [lists, setLists] = React.useState(initialLists)
  const [newTasks, setNewTasks] = React.useState(
    Object.fromEntries(initialLists.map((l) => [l.title, '']))
  )

  const handleToggleTask = (listTitle: string, taskId: string) => {
    setLists(
      lists.map((list) =>
        list.title === listTitle
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              )
            }
          : list
      )
    )
  }

  const handleAddTask = (listTitle: string) => {
    if (!newTasks[listTitle].trim()) return
    const newTask: Task = {
      id: `${listTitle.charAt(0).toLowerCase()}${Date.now()}`,
      text: newTasks[listTitle],
      completed: false
    }

    setLists(
      lists.map((list) =>
        list.title === listTitle ? { ...list, tasks: [...list.tasks, newTask] } : list
      )
    )

    setNewTasks({ ...newTasks, [listTitle]: '' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My To‑Do Lists
        </h1>
        <p className="text-muted-foreground">
          Organize your tasks and check them off as you go!
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT SIDE – To‑Do Lists */}
            <div className="md:col-span-2">
              <Tabs defaultValue="Homework" className="w-full">
                <TabsList className="flex-wrap">
                  {lists.map((list) => (
                    <TabsTrigger key={list.title} value={list.title}>
                      {list.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {lists.map((list) => (
                  <TabsContent key={list.title} value={list.title}>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        {list.tasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={(id) => handleToggleTask(list.title, id)}
                          />
                        ))}
                      </div>
                      <form
                        className="flex w-full items-center space-x-2"
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleAddTask(list.title)
                        }}
                      >
                        <Input
                          type="text"
                          placeholder="Add a new task..."
                          value={newTasks[list.title]}
                          onChange={(e) =>
                            setNewTasks({ ...newTasks, [list.title]: e.target.value })
                          }
                        />
                        <Button type="submit">
                          <PlusCircle className="h-4 w-4 mr-2" /> Add Task
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* RIGHT SIDE – Image and motivation */}
            <div className="hidden md:flex flex-col items-center justify-center bg-muted/50 rounded-lg p-6">
              <img
                src="https://i.postimg.cc/4NRRHK2g/image.png"
                alt="Stay productive!"
                className="rounded-lg shadow-lg mb-4"
              />
              <p className="text-center text-sm text-muted-foreground">
                ✨ Stay productive! Every small step counts.  
                Keep checking off those tasks!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
