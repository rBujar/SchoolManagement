"use client";

import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
    query,
    where,
    orderBy,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

type Note = {
    id: string;
    title: string;
    content: string;
    userId: string;
    timestamp: any; // Use `Date` or `Timestamp` if needed
};

const Notes = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState ("")

    const notesCollection = collection(db, "notes");

    // Fetch notes
    const fetchNotes = async () => {
        if (isSignedIn && user?.id){

            const notesQuery = query(
                notesCollection,
                where("userId", "==", user.id),
                orderBy("timestamp", "asc")

            )
        
        const snapshot = await getDocs(notesQuery);
        const notesData: Note[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Note, "id">),
        }));
        setNotes(notesData);
    }
    };

    useEffect(() => {
        fetchNotes();
    }, [isSignedIn, user]);


    // Create or Update Note
    const saveNote = async () => {

        if (!isSignedIn) {
            setError("User not authenticated.");
            return;
        }

        if (!user) {
            setError("No user data available.");
            return;
        }

        const userId = user.id;



        if (!title || !content) {
            setError("Title and content cannot be empty.");
            return;
        }

        setError("");


        if (editId) {
            const noteRef = doc(db, "notes", editId);
            await updateDoc(noteRef, { title, content, timestamp: Timestamp.now() });
            setEditId(null);
        } else {
            await addDoc(notesCollection, {
                title,
                content,
                userId: userId, // Replace with actual user ID
                timestamp: Timestamp.now(),
            });
        }
        setTitle("");
        setContent("");
        setShowForm(false);
        fetchNotes();
    };

    const deleteNote = async (id: string) => {
        const noteRef = doc(db, "notes", id);
        await deleteDoc(noteRef);
        fetchNotes();
    };

    const selectNote = (note: Note) => {
        setEditId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setShowForm(true);
    };

    return (
        <div className="w-full h-full overflow-auto p-4 bg-gray-100 rounded-md">

            
            <div className="mb-4 bg-white p-4 rounded-md shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Notes</h1>
                    <button
                        onClick={() => setShowForm(!showForm)} 
                        className="bg-blue-300 text-white px-4 py-2 rounded-md"
                    >
                        {showForm ? "Close" : "Add Note"}
                    </button>
                </div>

                {showForm && ( 
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-2"
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-2"
                        />
                        <button
                            onClick={saveNote}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            {editId ? "Update Note" : "Save Note"}
                        </button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                )}
            </div>

            
            <ul className="space-y-4">
                {notes.map((note: Note) => (
                    <li key={note.id} className="relative border border-gray-200 rounded-md p-4 shadow-md">
                        <h3 className="text-lg font-semibold">{note.title}</h3>
                        <p className="text-gray-700">{note.content}</p>
                        <div className="absolute bottom-2 right-2 flex space-x-0">
                            <button
                                onClick={() => selectNote(note)}
                                className="w-15 h-15 flex items-center justify-center rounded-full text-white px-3 py-2"
                            >
                                <Image src="/edit.png" alt="" width={32} height={32} />
                            </button>
                            <button
                                onClick={() => deleteNote(note.id)} 
                                className="w-15 h-15 flex items-center justify-center rounded-full  text-white px-3 py-2 "
                            >
                                <Image src="/delete2.png" alt="" width={32} height={32} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default Notes;
