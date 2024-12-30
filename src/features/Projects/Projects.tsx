import { type FC, useState, useMemo } from "react";
import styled from "styled-components";
import { 
  Box, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  IconButton, 
  Flex, 
  Badge,
  Tooltip,
  ButtonGroup,
  Divider
} from "@chakra-ui/react";
import { Text } from "@heelix-app/design";
import { useProject } from "../../state";
import { ProjectModal } from "@/components";
import { type Project } from "../../data/project";
import { Plus, File, Trash2, Edit, X } from 'lucide-react';

const Container = styled(Box)`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--space-l);
  gap: var(--space-l);
  max-width: var(--breakpoint-medium);
  margin: 0 auto;
  width: 100%;
`;

const StyledMenuButton = styled(MenuButton)`
  background-color: white;
  border: 1px solid var(--chakra-colors-gray-200);
  border-radius: var(--chakra-radii-md);
  padding: 8px 12px;
  height: 40px;
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--chakra-colors-gray-50);
    border-color: var(--chakra-colors-gray-300);
  }
  
  &:focus {
    box-shadow: 0 0 0 2px var(--chakra-colors-blue-100);
    border-color: var(--chakra-colors-blue-500);
  }
`;

export const Projects: FC<{
  selectedActivityId: number | null;
  onSelectActivity: (activityId: number | null) => void;
}> = ({ selectedActivityId, onSelectActivity }) => {
  const { state, selectProject, addProject, deleteProject, updateProject } = useProject();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<null | number>(null);

  const currentProject = useMemo(() => 
    state.projects.find(p => p.id === state.selectedProject),
    [state.projects, state.selectedProject]
  );

  const handleProjectSelect = (project: Project) => {
    selectProject(project.id);
  };

  const handleUnselectProject = () => {
    selectProject(undefined);
  };

  const handleNewProject = () => {
    setSelectedProjectId(null);
    setModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    deleteProject(project.id);
    if (state.selectedProject === project.id) {
      selectProject(undefined);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedProjectId(null);
  };

  const handleActivitySelect = (activityId: number) => {
    onSelectActivity(activityId);
  };

  return (
    <Container>
      <ProjectSelector
        projects={state.projects}
        selectedProject={currentProject}
        onSelectProject={handleProjectSelect}
        onUnselectProject={handleUnselectProject}
        onNewProject={handleNewProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        selectedActivityId={selectedActivityId}
        onSelectActivity={handleActivitySelect}
      />
      
      <ProjectModal
        isOpen={modalOpen}
        projectId={selectedProjectId}
        onClose={handleClose}
        onUpdate={updateProject}
        onSave={addProject}
      />
    </Container>
  );
};

const ProjectSelector: FC<{
  projects: Project[];
  selectedProject: Project | undefined;
  onSelectProject: (project: Project) => void;
  onUnselectProject: () => void;
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  selectedActivityId: number | null;
  onSelectActivity: (activityId: number) => void;
}> = ({
  projects,
  selectedProject,
  onSelectProject,
  onUnselectProject,
  onNewProject,
  onEditProject,
  onDeleteProject,
  selectedActivityId,
  onSelectActivity
}) => {
  const projectActivities = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.activities.map(activityId => ({
      id: activityId,
      name: `Document ${activityId}`
    }));
  }, [selectedProject]);

  return (
    <Flex direction="column" w="full" gap={4}>
      <Flex gap={2} w="full" align="center">
        <Menu>
          <Flex position="relative" w="full">
            <StyledMenuButton w="full">
              <Text type="m" bold>
                {selectedProject ? selectedProject.name : 'Select a Project'}
              </Text>
            </StyledMenuButton>
            {selectedProject && (
              <IconButton
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                aria-label="Unselect project"
                icon={<X size={14} />}
                size="xs"
                variant="ghost"
                zIndex="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUnselectProject();
                }}
                _hover={{ bg: 'gray.100' }}
              />
            )}
          </Flex>
          <MenuList>
            {projects.map(project => (
              <MenuItem 
                key={project.id}
                onClick={() => onSelectProject(project)}
                p={3}
              >
                <Flex justify="space-between" align="center" w="full">
                  <Text type="m">{project.name}</Text>
                  <Badge colorScheme="blue" ml={2}>
                    {project.activities.length} docs
                  </Badge>
                </Flex>
              </MenuItem>
            ))}
            <Divider my={2} />
            <MenuItem 
              icon={<Plus size={16} />}
              onClick={onNewProject}
              p={3}
            >
              <Text type="m">Create New Project</Text>
            </MenuItem>
          </MenuList>
        </Menu>
        <Tooltip label="Create New Project">
          <IconButton
            aria-label="Create new project"
            icon={<Plus size={16} />}
            size="sm"
            variant="ghost"
            onClick={onNewProject}
          />
        </Tooltip>
      </Flex>

      {selectedProject && (
        <Box 
          borderWidth="1px" 
          borderRadius="md" 
          overflow="hidden"
        >
          <Flex 
            bg="gray.50" 
            p={3} 
            borderBottomWidth="1px"
            justify="space-between"
            align="center"
          >
            <Text type="m" bold>Project Documents</Text>
            <ButtonGroup size="sm" spacing={1}>
              <IconButton
                aria-label="Edit project"
                icon={<Edit size={16} />}
                size="sm"
                variant="ghost"
                onClick={() => onEditProject(selectedProject)}
              />
              <IconButton
                aria-label="Delete project"
                icon={<Trash2 size={16} />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDeleteProject(selectedProject)}
              />
            </ButtonGroup>
          </Flex>
          <Box>
            {projectActivities.map((activity) => (
              <Flex
                key={activity.id}
                p={3}
                borderBottomWidth="1px"
                borderBottomColor="gray.100"
                _last={{ borderBottomWidth: 0 }}
                align="center"
                justify="space-between"
                _hover={{ bg: 'gray.50' }}
                transition="all 0.2s"
                bg={selectedActivityId === activity.id ? 'blue.50' : 'white'}
                onClick={() => onSelectActivity(activity.id)}
                cursor="pointer"
              >
                <Flex align="center" gap={2}>
                  <File size={16} />
                  <Text type="m">{activity.name}</Text>
                </Flex>
              </Flex>
            ))}
            {projectActivities.length === 0 && (
              <Flex 
                justify="center" 
                align="center" 
                p={8}
                color="gray.500"
                flexDirection="column"
                gap={2}
              >
                <File size={24} />
                <Text type="m">No documents added yet</Text>
              </Flex>
            )}
          </Box>
        </Box>
      )}
    </Flex>
  );
};