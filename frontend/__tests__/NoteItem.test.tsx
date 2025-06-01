import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteItem from '../src/components/NoteItem';
import { Note } from '@/types';
import '@testing-library/jest-dom';

describe('NoteItem Component', () => {
  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    content: 'Test content',
    archived: false,
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-02T12:00:00Z',
    tags: [
      { id: '1', name: 'Tag1' },
      { id: '2', name: 'Tag2' },
    ],
  };
  process.env.NEXT_PUBLIC_BACKEND_URL = 'http://mocked-backend-url.com';

  const mockDelete = jest.fn();
  const mockToggleArchive = jest.fn();
  const mockSetToEdit = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockDelete.mockClear();
    mockToggleArchive.mockClear();
    mockSetToEdit.mockClear();
  });

  it('renders note details correctly', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockDelete}
        onToggleArchive={mockToggleArchive}
        onSetToEdit={mockSetToEdit}
      />
    );
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockDelete}
        onToggleArchive={mockToggleArchive}
        onSetToEdit={mockSetToEdit}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('calls onToggleArchive when archive button is clicked', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockDelete}
        onToggleArchive={mockToggleArchive}
        onSetToEdit={mockSetToEdit}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /archive/i }));
    expect(mockToggleArchive).toHaveBeenCalledWith('1');
  });

  it('displays "Unarchive" if note is archived and calls onToggleArchive', () => {
    const archivedNote = { ...mockNote, archived: true };
    render(
      <NoteItem
        note={archivedNote}
        onDelete={mockDelete}
        onToggleArchive={mockToggleArchive}
        onSetToEdit={mockSetToEdit}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /unarchive/i }));
    expect(mockToggleArchive).toHaveBeenCalledWith('1');
  });

  it('calls onSetToEdit when edit button is clicked', () => {
    render(
      <NoteItem
        note={mockNote}
        onDelete={mockDelete}
        onToggleArchive={mockToggleArchive}
        onSetToEdit={mockSetToEdit}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockSetToEdit).toHaveBeenCalledWith(mockNote);
  });
});

afterAll(() => {
  delete process.env.NEXT_PUBLIC_BACKEND_URL;
});