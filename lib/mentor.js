'use babel';

import { CompositeDisposable, Range, Point } from 'atom';

export default {
	decoration: null,
	disposable: null,

  activate(state) {
		atom.workspace.observeActiveTextEditor(editor => {
			this.disposable = atom.project.onDidChangeFiles(events => {
				if (this.decoration !== null) {
					this.decoration.destroy();
				}

				let text = editor.getText();

				let lines = text.split('\n');
				lines = lines.map(line => line.trim());

				let start = lines.indexOf('////');
				let end = lines.indexOf('////', start + 1);

				if (start != -1 && end != -1) {
					range = new Range(new Point(start, 0), new Point(end + 1, 0));
					marker = editor.markBufferRange(range);
					decoration = editor.decorateMarker(marker, {type: 'line', class: 'my-line-class'});
					this.decoration = decoration;
				}
			});
		});
  },

  deactivate() {
    this.subscriptions.dispose();
		this.decoration.destroy();
		this.disposable.dispose();
  }
};
