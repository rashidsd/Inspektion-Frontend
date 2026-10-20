import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  getUserRoles,
  updateUserRoles,
} from "../../services/settings/role_service";
import { getUsersForSelection } from "../../services/settings/user_service";
import Switch from "@mui/material/Switch";
import AutoComplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import ERPSnakBar from "../../components/ERPSnakBar";

function AssignRoles() {
  const [userRoles, setUserRoles] = useState([]);
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    serverity: "",
  });

  const getRoles = async () => {
    const response: any = await getUserRoles("000");
    try {
      if (response.status) {
        setUserRoles(response.data);
      }
      return;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const response: any = await getUsersForSelection();
      try {
        if (response.status) {
          setUsers(response.data);
        }
        return;
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    getRoles();
  }, []);

  const handleUserChange = async (event: any, value: any) => {
    setSelectedUser(value);
    const roles: any = await getUserRoles(value.id);
    setUserRoles(roles.data);
  };

  const handleUpdateRoles = async () => {
    try {
      var roles: any = [];
      userRoles.map((group: any) => {
        group.roles.map((role: any) => {
          roles.push({
            userid: role.userid,
            roleid: role.id,
            is_assigned: role.is_assigned,
          });
        });
      });
      const updatedRoles = {
        userid: selectedUser!.id,
        roles,
      };
      const response: any = await updateUserRoles(updatedRoles);
      if (response.status) {
        setAlert({
          open: true,
          message: "Roles updated successfully",
          serverity: "success",
        });
        setUserRoles(response.data);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response ? error.response.data.msg : error.message,
        serverity: "error",
      });
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <AutoComplete
          sx={{
            mb: 2,
          }}
          options={users}
          loading={users.length === 0}
          getOptionLabel={(option) => option.user_name}
          renderInput={(params) => (
            <TextField {...params} label="Select User" />
          )}
          onChange={handleUserChange}
        />
        <Box>
          {userRoles.map((group: any, groupIndex: number) => (
            <Accordion key={group.id} sx={{ mb: 1 }}>
              <AccordionSummary
                sx={{ bgcolor: "primary.light", color: "common.white" }}
                expandIcon={<ExpandMoreIcon sx={{ color: "common.white" }} />}
              >
                <Typography variant="h6">{group.group_name}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                {group.roles.map((role: any, roleIndex: number) => (
                  <RoleComponent
                    key={role.id + role.is_assigned}
                    totalRoles={group?.roles?.length}
                    role={role}
                    groupIndex={groupIndex}
                    roleIndex={roleIndex}
                    userRoles={userRoles}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            onClick={handleUpdateRoles}
            sx={{ width: 100 }}
            variant="outlined"
            color="primary"
          >
            Save
          </Button>
        </Box>
      </Box>
      <ERPSnakBar
        open={alert.open}
        onClose={() => setAlert({ open: false, message: "", serverity: "" })}
        serverity={alert.serverity}
        message={alert.message}
      />
    </>
  );
}

function RoleComponent({
  userRoles,
  totalRoles,
  role,
  groupIndex,
  roleIndex,
}: {
  userRoles: any[];
  totalRoles: number;
  role: any;
  groupIndex: number;
  roleIndex: number;
}) {
  const [userRole, setUserRole] = useState(role);

  return (
    <Box>
      <Box
        component={"div"}
        sx={{
          width: 400,
          display: "flex",
          justifyContent: "space-between",
          borderBottom: totalRoles != roleIndex + 1 ? "1px solid #ccc" : "",
        }}
      >
        <Typography
          alignContent={"center"}
          sx={{
            flex: 1,
          }}
          variant="body1"
        >
          {role.role_name}
        </Typography>
        <Switch
          checked={userRole.is_assigned}
          onChange={(e) => {
            setUserRole({ ...userRole, ["is_assigned"]: e.target.checked });
            userRoles[groupIndex].roles[roleIndex].is_assigned =
              e.target.checked;
          }}
        />
      </Box>
    </Box>
  );
}

export default AssignRoles;
