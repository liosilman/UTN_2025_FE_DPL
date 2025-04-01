import { createContext, useState, useContext, useEffect } from 'react';
import { getWorkspaces, getWorkspaceById } from '../services/workspaceService';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchWorkspaces();
    }
  }, [currentUser]);

  const fetchWorkspaces = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaces();
      setWorkspaces(response.data.workspaces || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los workspaces');
      console.error('Error fetching workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaceById = async (workspaceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaceById(workspaceId);
      setCurrentWorkspace(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el workspace');
      console.error('Error fetching workspace:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchWorkspaces,
    fetchWorkspaceById,
    setCurrentWorkspace
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};