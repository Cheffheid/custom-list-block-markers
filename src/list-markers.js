import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls } from "@wordpress/block-editor";
import {
  PanelBody,
  PanelRow,
  ColorPalette,
  ToggleControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import TokenList from "@wordpress/token-list";

/**
 * Renders the edit component for the list block.
 *
 * @param {Object}   props                        - The properties passed to the component.
 * @param {Object}   props.attributes             - The attributes of the list block.
 * @param {boolean}  props.attributes.showMarker  - This list should display a marker.
 * @param {string}   props.attributes.markerColor - The marker color.
 * @param {string}   props.attributes.className   - The current classname.
 * @param {Function} props.setAttributes          - The function to set the attributes of the list block.
 * @return {JSX.Element} The rendered edit component.
 */
function Edit({
  attributes: { showMarker, markerColor, className },
  setAttributes,
}) {
  const updateColor = (newColor) => {
    // Update Marker Color value.
    setAttributes({
      markerColor: newColor,
    });
  };

  const updateMarkerToggle = (toggleState) => {
    const currentClasses = new TokenList(className);

    if (toggleState) {
      currentClasses.add("cs-list");
    } else {
      currentClasses.remove("cs-list");
    }

    // Update Marker Toggle value, as well as the classname.
    setAttributes({
      showMarker: toggleState,
      className: currentClasses.value,
    });
  };

  const themePalette = useSelect("core/block-editor").getSettings().colors;

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Marker Color")}>
          <PanelRow>
            <ToggleControl
              __nextHasNoMarginBottom
              label={__("Display List Item Markers")}
              checked={showMarker}
              onChange={updateMarkerToggle}
            />
          </PanelRow>
          {showMarker && (
            <PanelRow>
              <ColorPalette
                colors={themePalette}
                disableCustomColors={true}
                value={markerColor}
                onChange={updateColor}
              />
            </PanelRow>
          )}
        </PanelBody>
      </InspectorControls>
    </>
  );
}

/**
 * Updates the list block render styles with our custom marker color variable, if set.
 */
const addMarkerInlineStyleToListBlocks = createHigherOrderComponent(
  (BlockListBlock) => {
    return (props) => {
      if (props.name !== "core/list") {
        return <BlockListBlock {...props} />;
      }

      const customWrapperProps = {};

      if (props.attributes.showMarker) {
        customWrapperProps.style = {
          "--wp--custom-marker-color": props.attributes.markerColor,
        };
      }

      return <BlockListBlock {...props} wrapperProps={customWrapperProps} />;
    };
  },
  "withInlineStyle"
);

addFilter(
  "blocks.registerBlockType",
  "cheffism/custom-marker-color",
  (settings, name) => {
    if (name !== "core/list") {
      return settings;
    }

    return {
      ...settings,
      attributes: {
        ...settings.attributes,
        markerColor: {
          type: "string",
          default: "",
        },
        showMarker: {
          type: "boolean",
          default: false,
        },
      },
    };
  }
);

addFilter(
  "editor.BlockEdit",
  "cheffism/custom-marker-color",
  createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      if (props.name !== "core/list") {
        return <BlockEdit {...props} />;
      }

      return (
        <>
          <BlockEdit {...props} />
          <Edit {...props} />
        </>
      );
    };
  })
);

addFilter(
  "editor.BlockListBlock",
  "cheffism/add-marker-inline-style-to-lists",
  addMarkerInlineStyleToListBlocks
);
