'use babel';

import MentorView from './mentor-view';
import { CompositeDisposable, Range, Point } from 'atom';

export default {

  mentorView: null,
  modalPanel: null,
  subscriptions: null,
	highlight: false,
	decorations: [],

  activate(state) {
    this.mentorView = new MentorView(state.mentorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mentorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mentor:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mentorView.destroy();
  },

  serialize() {
    return {
      mentorViewState: this.mentorView.serialize()
    };
  },

  toggle() {
		this.highlight = !this.highlight;

		atom.workspace.observeActiveTextEditor(editor => {
			if (this.highlight) {
				text = editor.getText();

				lines = text.split('\n');
				lines = lines.map(line => line.trim());

				start = lines.indexOf('////');
				end = lines.indexOf('////', start + 1);

				if (start != -1 && end != -1) {
					range = new Range(new Point(start, 0), new Point(end + 1, 0));
					marker = editor.markBufferRange(range);
					decoration = editor.decorateMarker(marker, {type: 'line', class: 'my-line-class'});

					this.decorations.push(decoration);
				}
			}
			else {
				this.decorations.forEach(decoration => decoration.destroy());
				this.decorations = [];
			}
		});
  }

};
