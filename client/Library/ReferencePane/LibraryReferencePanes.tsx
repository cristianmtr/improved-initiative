import * as React from "react";
import { LibrariesCommander } from "../../Commands/LibrariesCommander";
import { Button } from "../../Components/Button";
import { Info } from "../../Components/Info";
import { Tabs } from "../../Components/Tabs";
import { env } from "../../Environment";
import { TextEnricher } from "../../TextEnricher/TextEnricher";
import { TutorialSpy } from "../../Tutorial/TutorialSpy";
import { Libraries, LibraryFriendlyNames, LibraryType } from "../Libraries";
import { EncounterLibraryReferencePane } from "./EncounterLibraryReferencePane";
import { PersistentCharacterLibraryReferencePane } from "./PersistentCharacterLibraryReferencePane";
import { SpellLibraryReferencePane } from "./SpellLibraryReferencePane";
import { StatBlockLibraryReferencePane } from "./StatBlockLibraryReferencePane";

export interface LibraryReferencePanesProps {
  librariesCommander: LibrariesCommander;
  statBlockTextEnricher: TextEnricher;
  libraries: Libraries;
}

interface State {
  selectedLibrary: LibraryType;
}

export class LibraryReferencePanes extends React.Component<
  LibraryReferencePanesProps,
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedLibrary: "StatBlocks"
    };
  }

  private hideLibraries = () => this.props.librariesCommander.HideLibraries();
  private selectLibrary = (library: LibraryType) => {
    if (library == "PersistentCharacters") {
      TutorialSpy("SelectCharactersTab");
    }
    this.setState({ selectedLibrary: library });
  };

  public render() {
    const libraries: Record<LibraryType, JSX.Element> = {
      StatBlocks: (
        <StatBlockLibraryReferencePane
          librariesCommander={this.props.librariesCommander}
          library={this.props.libraries.StatBlocks}
          statBlockTextEnricher={this.props.statBlockTextEnricher}
        />
      ),
      PersistentCharacters: (
        <PersistentCharacterLibraryReferencePane
          librariesCommander={this.props.librariesCommander}
          library={this.props.libraries.PersistentCharacters}
          statBlockTextEnricher={this.props.statBlockTextEnricher}
        />
      ),
      Encounters: (
        <EncounterLibraryReferencePane
          librariesCommander={this.props.librariesCommander}
          library={this.props.libraries.Encounters}
        />
      ),
      Spells: (
        <SpellLibraryReferencePane
          librariesCommander={this.props.librariesCommander}
          library={this.props.libraries.Spells}
          textEnricher={this.props.statBlockTextEnricher}
        />
      )
    };

    const selectedLibrary = libraries[this.state.selectedLibrary];

    return (
      <div className="libraries">
        <div className="libraries__header">
          <LibraryHeader selectedLibrary={this.state.selectedLibrary} />
          <Button
            additionalClassNames="button--close"
            fontAwesomeIcon="times"
            onClick={this.hideLibraries}
          />
        </div>
        <Tabs
          optionNamesById={LibraryFriendlyNames}
          onChoose={this.selectLibrary}
          selected={this.state.selectedLibrary}
        />
        {selectedLibrary}
      </div>
    );
  }
}

function LibraryHeader(props: { selectedLibrary: LibraryType }) {
  const headerTexts: Record<LibraryType, string> = {
    StatBlocks: "Add Combatants",
    PersistentCharacters: "Add Combatants",
    Encounters: "Load Encounters",
    Spells: "Reference Spells"
  };

  const libraryInfos: Record<LibraryType, string | null> = {
    StatBlocks:
      "When you add a Creature, a copy of its Stat Block joins the Encounter as a Combatant.",
    PersistentCharacters:
      "Each Character can each only be added to an Encounter once, and they will be persistent across different Encounters.",
    Encounters:
      "Loading an Encounter adds all of the Combatants saved in it. Characters who are already present are not duplicated.",
    Spells: null
  };

  const hasAccountSync = env.HasStorage;
  return (
    <h2 style={{ flexShrink: 1 }}>
      {hasAccountSync && (
        <span className="fas fa-cloud" title="Account Sync is enabled" />
      )}
      {" " + headerTexts[props.selectedLibrary]}
      {libraryInfos[props.selectedLibrary] !== null && (
        <Info children={libraryInfos[props.selectedLibrary]} />
      )}
    </h2>
  );
}
