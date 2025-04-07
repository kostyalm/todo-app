import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarOff, Trash2, Pencil, Plus } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newTodo.trim(),
      favorite: false
    };
    setTodos([newItem, ...todos]);
    setNewTodo("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleFavorite = (id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, favorite: !todo.favorite } : todo
    );
    updated.sort((a, b) => b.favorite - a.favorite);
    setTodos(updated);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, text: editingText } : todo
    );
    setTodos(updated);
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Список дел</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Новое дело..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button onClick={addTodo} className="shrink-0">
          <Plus />
        </Button>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded-2xl shadow-sm"
          >
            <CardContent className="flex items-center gap-2 w-full justify-between">
              <div className="flex items-center gap-2 w-full">
                {editingId === todo.id ? (
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-base">{todo.text}</span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(todo.id)}
                >
                  {todo.favorite ? (
                    <Star className="text-yellow-400" />
                  ) : (
                    <StarOff />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    editingId === todo.id
                      ? saveEdit(todo.id)
                      : startEditing(todo.id, todo.text)
                  }
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
