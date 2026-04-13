# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['/Users/pla-tony-mbp/Desktop/vueAi/vuwAi/launch.py'],
    pathex=[],
    binaries=[],
    datas=[('/Users/pla-tony-mbp/Desktop/vueAi/vuwAi/assets', 'assets')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='Vue AI Chat',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['/Users/pla-tony-mbp/Desktop/vueAi/vuwAi/assets/icon.png'],
)
app = BUNDLE(
    exe,
    name='Vue AI Chat.app',
    icon='/Users/pla-tony-mbp/Desktop/vueAi/vuwAi/assets/icon.png',
    bundle_identifier=None,
)
