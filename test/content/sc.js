import assert from 'assert';
import { parseTimelineTextToSeconds } from '../../src/content/sc';

describe('sc helper functions', function() {
  describe('parseTimelineTextToSeconds', function() {
    it('should parse a hh:mm:ss format', function() {
      const p = parseTimelineTextToSeconds;

      assert.equal(60, p('01:00'));
      assert.equal(60, p('1:00'));
      assert.equal(60, p('00:01:00'));

      assert.equal(30, p('0:30'));

      assert.equal(3 * 60 * 60 + 19 * 60 + 45, p('03:19:45'));
    });
  });
});