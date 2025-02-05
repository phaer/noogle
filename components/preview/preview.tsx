import React from "react";
import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import { DocItem } from "../../models/nix";
import CodeIcon from "@mui/icons-material/Code";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import InputIcon from "@mui/icons-material/Input";
import { MarkdownPreview } from "../markdownPreview";
import { CodeHighlight } from "../codeHighlight";

interface PreviewProps {
  docItem: DocItem;
  closeComponent?: React.ReactNode;
  handleClose?: () => void;
}

export const Preview = (props: PreviewProps) => {
  const { docItem, handleClose, closeComponent = undefined } = props;
  const { name, description, category, example, fn_type, id } = docItem;
  const theme = useTheme();

  const prefix = category.split(/([\/.])/gm).at(4) || "builtins";
  const libName = category
    .match(/(?:[a-zA-Z]*)\.nix/gm)?.[0]
    ?.replace(".nix", "");
  const sanitizedName = name.replace("'", "-prime");
  const libDocsRef = `https://nixos.org/manual/nixpkgs/stable/#function-library-lib.${libName}.${sanitizedName}`;
  const builtinsDocsRef = `https://nixos.org/manual/nix/stable/language/builtins.html#builtins-${name}`;
  return (
    <Box
      sx={{
        p: { xs: 0.5, md: 1 },
        width: "100%",
        overflow: "none",
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "flex" },
          flexDirection: { md: "row", xs: "column-reverse" },
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{ wordWrap: "normal", lineBreak: "anywhere" }}
        >
          {`${id}`}
        </Typography>
        {closeComponent || (
          <Tooltip title="close details">
            <IconButton
              sx={{
                mx: { xs: "auto", md: 1 },
                left: { lg: "calc(50% - 2rem)", xs: "unset" },
                position: { lg: "absolute", xs: "relative" },
              }}
              size="small"
              onClick={() => handleClose?.()}
            >
              <ExpandLessIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {prefix !== "builtins" && (
        <Box sx={{ my: 1 }}>
          <Typography variant="subtitle1">{`short form: lib.${name}`}</Typography>
        </Box>
      )}
      <List sx={{ width: "100%" }} disablePadding>
        <ListItem sx={{ flexDirection: { xs: "column", sm: "row" }, px: 0 }}>
          <ListItemIcon>
            <Tooltip title={"read docs"}>
              <MuiLink
                sx={{ m: "auto", color: "primary.light" }}
                target="_blank"
                href={!id.includes("builtins") ? libDocsRef : builtinsDocsRef}
              >
                <LocalLibraryIcon sx={{ m: "auto" }} />
              </MuiLink>
            </Tooltip>
          </ListItemIcon>
          <ListItemText
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              alignSelf: "flex-start",
              width: "100%",
              px: 0,
            }}
            primaryTypographyProps={{
              color: "text.secondary",
              fontSize: 14,
            }}
            secondaryTypographyProps={{
              color: "text.primary",
              fontSize: "1rem",
              component: "div",
            }}
            primary={
              !id.includes("builtins") ? (
                <Tooltip title={"browse source code"}>
                  <MuiLink
                    target={"_blank"}
                    href={`https://github.com/NixOS/nixpkgs/blob/master/${category.replace(
                      "./",
                      ""
                    )}`}
                  >
                    {"github:NixOS/nixpkgs/" + category.replace("./", "")}
                  </MuiLink>
                </Tooltip>
              ) : (
                "github:NixOS/nix/" + category.replace("./", "")
              )
            }
            secondary={
              <Container
                component={"div"}
                sx={{
                  ml: "0 !important",
                  pl: "0 !important",
                  overflow: "visible",
                }}
                maxWidth="md"
              >
                {Array.isArray(description)
                  ? description.map((d, idx) => (
                      <MarkdownPreview key={idx} description={d} />
                    ))
                  : description && (
                      <MarkdownPreview description={description} />
                    )}
              </Container>
            }
          />
        </ListItem>
        <ListItem sx={{ flexDirection: { xs: "column", sm: "row" }, px: 0 }}>
          <ListItemIcon>
            <Tooltip title={"browse source code"}>
              <MuiLink
                sx={{ m: "auto", color: "primary.light" }}
                target="_blank"
                href={`https://github.com/NixOS/nixpkgs/blob/master/${category.replace(
                  "./",
                  ""
                )}`}
              >
                <InputIcon sx={{ m: "auto" }} />
              </MuiLink>
            </Tooltip>
          </ListItemIcon>
          <ListItemText
            sx={{
              overflow: "hidden",
              width: "100%",
              textOverflow: "ellipsis",
              alignSelf: "flex-start",
            }}
            primaryTypographyProps={{
              color: "text.secondary",
              fontSize: 14,
            }}
            secondaryTypographyProps={{
              color: "text.primary",
              fontSize: "1rem",
            }}
            secondary={fn_type || "no type provided yet."}
            primary="function signature "
          />
        </ListItem>
        {example && (
          <ListItem
            sx={{
              backgroundColor: "background.paper",
              flexDirection: { xs: "column", sm: "row" },
              px: 0,
            }}
          >
            <ListItemIcon>
              <CodeIcon sx={{ m: "auto" }} />
            </ListItemIcon>

            <ListItemText
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                alignSelf: "flex-start",
                width: "100%",
                px: 0,
              }}
              disableTypography
              primary={
                <Typography sx={{ color: "text.secondary" }}>
                  Example
                </Typography>
              }
              secondary={
                <CodeHighlight code={example} theme={theme.palette.mode} />
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};
