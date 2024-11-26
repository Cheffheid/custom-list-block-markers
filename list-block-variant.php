<?php
/**
 * Plugin Name:     Custom List Block Markers
 * Description:     An example block variant plugin that modifies the core list block and enables custom list markers.
 * Version:         1.0.0
 * Author:          Jeffrey de Wit
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     custom-list-block-markers
 *
 * @package Cheffism\ListBlockVariant
 */

namespace Cheffism\ListBlockVariant;

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue the Custom List Marker scripts and styles.
 *
 * @return void
 */
function register_list_block_variant() {
	$asset_file_path = get_template_directory() . '/build/js/index.asset.php';

	if ( is_readable( $asset_file_path ) ) {
		$asset_file = include $asset_file_path;
	} else {
		$asset_file = array(
			'version'      => '1.0.0',
			'dependencies' => array( 'react-jsx-runtime', 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-data', 'wp-hooks', 'wp-i18n', 'wp-token-list' ),
		);
	}

	wp_enqueue_script(
		'list_markers',
		plugin_dir_url( __FILE__ ) . '/build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_enqueue_style(
		'list_markers',
		plugin_dir_url( __FILE__ ) . '/build/index.css',
		array(),
		$asset_file['version'],
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\register_list_block_variant' );

/**
 * Add inline CSS variable to list blocks with the cs-list class.
 *
 * @param  string   $block_content HTML markup of the block.
 * @param  WP_Block $block         Block Class instance.
 * @return string                   Modified block content
 */
function add_list_block_marker_properties( $block_content, $block ) {

	if ( ! isset( $block['attrs']['showMarker'] ) || ! $block['attrs']['showMarker'] ) {
		return $block_content;
	}

	if ( ! isset( $block['attrs']['markerColor'] ) || '' === $block['attrs']['markerColor'] ) {
		return $block_content;
	}

	$variable_attribute = '--wp--custom-marker-color: ' . $block['attrs']['markerColor'] . ';';

	if ( str_contains( $block_content, 'style="' ) ) {
		$block_content = str_replace(
			'style="',
			'style="' . $variable_attribute,
			$block_content,
		);
	} else {
		$block_content = str_replace(
			'<ul ',
			'<ul style="' . $variable_attribute . '" ',
			$block_content,
		);
	}

	return $block_content;
}
add_filter( 'render_block_core/list', __NAMESPACE__ . '\add_list_block_marker_properties', 10, 2 );
