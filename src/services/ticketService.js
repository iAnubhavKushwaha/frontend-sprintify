// src/services/ticketService.js
import API from '../utils/axios';

export const createTicket = async (ticketData) => {
  const response = await API.post('/tickets', ticketData);
  return response.data;
};

export const getTicketsByProject = async (projectId) => {
  const response = await API.get(`/tickets/${projectId}`);
  return response.data;
};

export const updateTicket = async (ticketId, updateData) => {
  const response = await API.put(`/tickets/${ticketId}`, updateData);
  return response.data;
};

export const deleteTicket = async (ticketId) => {
  const response = await API.delete(`/tickets/${ticketId}`);
  return response.data;
};

export const getAllTickets = async () => {
  const response = await API.get('/tickets/all');
  return response.data;
};